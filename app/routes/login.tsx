import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "../sessions";
import { parse } from "cookie";

function getCookieValue(cookiesArray, cookieName) {
  for (const cookieString of cookiesArray) {
    const cookie = parse(cookieString);
    if (cookie[cookieName]) {
      return cookie[cookieName];
    }
  }
  return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  let session = await getSession(request.headers.get("cookie"));

  try {
    // Fetch CSRF cookie from Laravel backend
    const csrfResponse = await fetch(
      "https://staging-studio-api.jogg.co/csrf-cookie",
      {
        method: "GET",
      }
    );

    // Collect all 'Set-Cookie' headers
    const setCookieHeaders = [];
    csrfResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        setCookieHeaders.push(value);
      }
    });

    if (setCookieHeaders.length === 0) {
      throw new Error("Set-Cookie headers not found in CSRF response");
    }

    // Combine cookies into a single string for the 'Cookie' header
    const cookies = setCookieHeaders
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    // Parse the cookies to extract the CSRF token
    const csrfToken = getCookieValue(setCookieHeaders, "XSRF-TOKEN");

    if (!csrfToken) {
      throw new Error("CSRF token not found in cookies");
    }

    // Prepare headers for login request
    const myHeaders = new Headers();
    myHeaders.append("X-XSRF-TOKEN", csrfToken);
    myHeaders.append("Content-Type", "application/json");
    // Include the cookies from the CSRF response
    myHeaders.append("Cookie", cookies);

    const response = await fetch("https://staging-studio-api.jogg.co/login", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    console.log(response, "$$%%%%%%%$$$$$$$");

    // Collect 'Set-Cookie' headers from the login response
    const loginSetCookieHeaders = [];
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        loginSetCookieHeaders.push(value);
      }
    });

    if (loginSetCookieHeaders.length === 0) {
      throw new Error("Set-Cookie headers not found in login response");
    }

    // Get the session token from the login cookies
    const token = getCookieValue(loginSetCookieHeaders, "studio_session"); // Replace with your actual session cookie name

    if (!token) {
      throw new Error("Session token not found in login cookies");
    }

    // Store the session token and CSRF token in the Remix session
    session.set("token", token);
    session.set("csrf", csrfToken);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    return json({ error: "Login failed" }, { status: 500 });
  }
};

export default function LoginForm() {
  return (
    <div>
      <form method="post">
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
