import { Form } from "@remix-run/react";

export function LogoutButton() {
  return (
    <Form method="post" action="/logout">
      <button type="submit">Log Out</button>
    </Form>
  );
}
