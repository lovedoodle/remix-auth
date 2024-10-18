import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { useState } from "react";
import Axios from "axios";

export const axios = Axios.create({
  baseURL: "https://staging-studio-api.jogg.co",
  withCredentials: true,
  withXSRFToken: true,
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  try {
    const csrf = await fetch("https://staging-studio-api.jogg.co/csrf-cookie", {
      method: "GET",
      headers: {
        "Content-Type": "application",
      },
    });

    const csrfToken = csrf.headers.get("Set-Cookie");

    console.log(csrfToken, 9999974574747474747474747474);
    // console.log(
    //   csrfToken
    //     .split("; ") // Split the cookies into an array
    //     .find((row) => row.startsWith("XSRF-TOKEN=")) // Find the cookie with the name 'XSRF-TOKEN'
    //     ?.split("=")[1]
    // );

    const response = await fetch("https://staging-studio-api.jogg.co/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
      credentials: "include",
    });

    // console.log(response, "response object 000000000000000000000000000");

    // if (!response.ok) {
    //   throw new Error(`Login failed: ${response.statusText}`);
    // }

    // Forward the Set-Cookie header from the backend API to the browser
    const setCookieHeader = response.headers.get("Set-Cookie");

    // console.log(
    //   response.headers.get("Set-Cookie"),
    //   "coookie header &&&&&&&&&&&&"
    // );
    if (!setCookieHeader) {
      throw new Error("No Set-Cookie header received from the backend.");
    }
    const headers = new Headers();
    headers.append("Set-Cookie", `${setCookieHeader},${csrfToken}`);
    if (csrfToken) {
      headers.append("X-XSRF-TOKEN", csrfToken);
    }

    console.log(response, "response object 000000000000000000000000000");

    console.log(headers, "headers object 000000000000000000000000000");
    return redirect("/dashboard", {
      headers,
    });

    // console.log(csrf, 9999974574747474747474747474);
    // const res = await axios.post("login", Object.fromEntries(formData));
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
