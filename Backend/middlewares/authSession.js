import { getSession } from "@auth/express";
import Google from "@auth/express/providers/google";

// 👇 reuse your existing config
const authOptions = {
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  basePath: "/auth", // 👈 important
};

export async function authSession(req, res, next) {
  try {
    const session = await getSession(req, authOptions);
    res.locals.session = session;
  } catch (err) {
    console.error("Failed to get session:", err);
    res.locals.session = null;
  }
  next();
}
