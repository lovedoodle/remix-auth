import User from "../../component/User";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: ActionFunctionArgs) => {
  //   const formData = await request.formData();
  // const credentials = Object.fromEntries(formData);
  const cookieHeader = request.headers.get("Cookie");
  const host = request.headers.get("Host");
  const requestHeaders = request.headers;
  const xsrfToken = cookieHeader
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
  requestHeaders.set("X-XSRF-TOKEN", xsrfToken);
  console.log(requestHeaders, "requestHeaders 000000009999998888");

  console.log(request.headers, "&&&&&&&&&^^^^^^^^%%%%%%%");
  console.log(cookieHeader, "hosttttttt");

  //   console.log(xsrfToken, "xsrfToken99999999");

  //   cookieHeader["X-XSRF-TOKEN"] = xsrfToken;
  //   console.log(xsrfToken, "xsrfToken 88888888888888888888");

  //   console.log(request, "&&&&&^^^^^%%%$$$$$$####@@@");

  try {
    const user = await fetch("https://staging-studio-api.jogg.co/me", {
      method: "GET",
      headers: request.headers,
      //   headers: {
      //     "Content-Type": "application/json",
      //     // Include the original cookies from the incoming request
      //     Cookie: cookieHeader,
      //   },
    });
    // console.log("API response headers:", Array.from(user.headers));
    // console.log(user.headers, "user oberject #######@@@@@@@@@@@@");
    return { user: await user.json() };

    // console.log(csrf, 9999974574747474747474747474);
    // const res = await axios.post("login", Object.fromEntries(formData));
  } catch (err) {
    return null;
    console.log(err, "error}");
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("log out");
  await fetch("https://staging-studio-api.jogg.co/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export default function dashboard() {
  //   const { user } = useLoaderData<typeof loader>();
  //   console.log(user, "user object");
  //   if (!user) {
  //     return null;
  //   }
  return (
    <div>
      <button type="submit">log out</button>
      <h1>Dashboarding12</h1>
      <User />
    </div>
  );
}
