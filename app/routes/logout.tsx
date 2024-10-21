import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "../sessions";

// Action function for the logout route
export let action = async ({ request }: { request: Request }) => {
  // Get the session from the request
  let session = await getSession(request.headers.get("Cookie"));

  try {
    // Clear the session data
    const res = await fetch("https://staging-studio-api.jogg.co/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": session.get("token"),
      },
      credentials: "include",
    });

    console.log(res, "logout response");

    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error) {
    console.error("Error during logout:", error);

    // Destroy the session (i.e., log the user out)
  }
};

// Loader to handle direct GET requests
export let loader = async () => {
  // Redirect to login (or another page)
  return redirect("/login");
};
