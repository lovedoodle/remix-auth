import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "../sessions";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

function getCookieValue(cookieHeader, cookieName) {
  const cookies = cookieHeader.split(";");
  const cookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${cookieName}=`)
  );
  console.log(cookie, "cookie");
  if (cookie) {
    return cookie.split("=")[1];
  }
  return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));

  let session = await getSession(request.headers.get("cookie"));

  try {
    const csrf = await fetch("https://staging-studio-api.jogg.co/csrf-cookie", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Correct Content-Type header
      },
    });

    console.log(csrf, "csrf object");

    const setCookieHeader = csrf.headers.get("Set-Cookie");

    if (!setCookieHeader) {
      throw new Error("Set-Cookie header not found in CSRF response");
    }

    const csrfToken = await getCookieValue(setCookieHeader, "XSRF-TOKEN");
    console.log(csrfToken, "csrfToken@@@@@@@@@@@@");
    // const sessionToken = getCookieValue(setCookieHeader, "studio_session");
    // console.log(sessionToken, "sessionToken ((((99999");
    // const result = `XSRF-TOKEN=${csrfToken}, studio_session=${csrfToken}`;

    if (!csrfToken) {
      throw new Error("CSRF token not found");
    }

    // Prepare headers for login request
    const myHeaders = await new Headers();
    await myHeaders.append("X-XSRF-TOKEN", csrfToken);
    // myHeaders.append("Cookie", setCookieHeader);
    await myHeaders.append("Content-Type", "application/json");
    await myHeaders.append("Origin", "https://local.jogg.co");

    console.log(myHeaders, "myHeaders");

    const response = await fetch("https://staging-studio-api.jogg.co/login", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(Object.fromEntries(formData)),
      credentials: "include",
    });

    console.log(response, "log in response");

    // if (!response.ok) {
    //   throw new Error(`Login failed: ${response.statusText}`);
    // }

    const token = getCookieValue(
      response.headers.get("Set-Cookie"),
      "studio_session"
    );
    console.log(token, "token");

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
