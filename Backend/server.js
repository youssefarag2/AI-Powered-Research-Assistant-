import express from "express";
import dotenv from "dotenv";
import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import connectDB from "./config/db.js";
import driveRoutes from "./routes/drive.route.js";
import { authSession } from "./middlewares/authSession.js"; // custom session loader

// 1. Load environment variables
dotenv.config();
console.log(process.env.MONGO_URI);

// 2. Connect to MongoDB
connectDB();

// 3. Define Auth.js options
const authOptions = {
  providers: [Google],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  basePath: "/auth",
};

// 4. Setup Express
const app = express();
app.set("trust proxy", true);

// 5. Auth.js session loader middleware (injects session into res.locals)
app.use(authSession); // 🧠 Before any route that needs session

// 6. Mount Auth.js handler at /auth
// 7. Routes
app.use("/", driveRoutes);

app.get("/auth/me", (req, res) => {
  res.json(res.locals.session ?? { auth: null });
});

app.get("/", (req, res) => {
  const session = res.locals.session;
  res.send(session ? `Welcome, ${session.user.name}` : "Hello, guest");
});

app.use("/auth", ExpressAuth(authOptions)); // 🛡️ Handles login/signup/logout

// 8. Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}!!!`);
});
