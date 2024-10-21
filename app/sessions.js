// app/sessions.server.ts

import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__remix_session",
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
      //   expires: new Date(Date.now() + 60 * 1000),
    },
  });

export { getSession, commitSession, destroySession };
