import {
  Form,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  Link,
  NavLink,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import appStylesHref from "./app.css?url";
import type { LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
// import LoginForm from "./component/signin";
import { getContacts, createEmptyContact } from "./data";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
  return json({ contact });
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  console.log("App", navigation.state);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <NavLink
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
            to={`dashboard`}
          >
            <Link to={`dashboard`}>dashboard</Link>
          </NavLink>
          <NavLink
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
            to={`dashboard/settings`}
          >
            <Link to={`dashboard/settings`}>settings</Link>
          </NavLink>
          {/* <LoginForm /> */}
        </div>
        <div
          className={navigation.state === "loading" ? "loading" : ""}
          id="detail"
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
