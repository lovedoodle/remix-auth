import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "../sessions";

function getCookieValue(cookies, name) {
  const cookie = cookies
    .split(";")
    .find((c) => c.trim().startsWith(name + "="));
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
        "Content-Type": "application",
      },
    });

    console.log(csrf, "csrf object 000000000000000000000000000");
    session.set("csrf", csrf.headers.get("Set-Cookie"));

    const csrfToken = await getCookieValue(
      csrf.headers.get("Set-Cookie"),
      "XSRF-TOKEN"
    );
    console.log(csrfToken, "csr token9999974574747474747474747474");

    const myHeaders = new Headers();
    myHeaders.append("X-XSRF-TOKEN", csrfToken || "");
    myHeaders.append("Cookie", csrf.headers.get("Set-Cookie") || "");

    const response = await fetch("https://staging-studio-api.jogg.co/login", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(Object.fromEntries(formData)),
      credentials: "include",
    });

    // console.log(response, "response object 000000000000000000000000000");

    // if (!response.ok) {
    //   throw new Error(`Login failed: ${response.statusText}`);
    // }

    // const headers = new Headers();
    // headers.append("Set-Cookie", `${setCookieHeader},${csrfToken}`);
    // if (csrfToken) {
    //   headers.append("X-XSRF-TOKEN", csrfToken);
    // }
    const token = response.headers.get("Set-Cookie");
    console.log(token, "token object 000000000000000000000000000");

    session.set("token", `${token}`);

    console.log(response, "log in response object 000000000000000000000000000");

    // console.log(headers, "headers object 000000000000000000000000000");
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
