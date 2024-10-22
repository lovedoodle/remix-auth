// import User from "../../component/User";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LogoutButton } from "../../component/Logout";
import { getSession } from "../../sessions";
// function getCookieValue(cookies, name) {
//   const cookie = cookies
//     .split(";")
//     .find((c) => c.trim().startsWith(name + "="));
//   if (cookie) {
//     return cookie.split("=")[1];
//   }
//   return null;
// }

// export const loader = async ({ request }: ActionFunctionArgs) => {
//   let session = await getSession(request.headers.get("cookie"));
//   let token = session.get("token");
//   console.log(request.headers, "request headers $$$4");
//   const myHeaders = new Headers();
//   myHeaders.append("Cookie", session.get("csrf"));
//   const result = await getCookieValue(session.get("csrf"), "XSRF-TOKEN");
//   console.log(result, "result");
//   myHeaders.append("X-XSRF-TOKEN", result);
//   console.log(token, "me token");
//   console.log(session.get("csrf"), "csfr token");

//   try {
//     const user = await fetch("https://staging-studio-api.jogg.co/me", {
//       method: "GET",
//       headers: myHeaders,
//       credentials: "include",
//     });
//     return { user: await user.json() };
//   } catch (err) {
//     return null;
//   }
// };

export default function dashboard() {
  // const { user } = useLoaderData<typeof loader>();
  // console.log(user, "user object 1");

  // if (!user) {
  //   return null;
  // }
  return (
    <div>
      {/* <LogoutButton /> */}

      <h1>Dashboarding12</h1>
      {/* <User /> */}
    </div>
  );
}
