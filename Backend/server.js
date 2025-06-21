import express from "express";
import dotenv from "dotenv"; // 1. Import dotenv first
import authRoutes from "./routes/auth.route.js  ";

// 2. Configure dotenv IMMEDIATELY
dotenv.config();
console.log(process.env.MONGO_URI);

// 3. NOW import your other modules, like your DB connection
import connectDB from "./config/db.js";

// 4. Connect to the Database
connectDB();

const app = express();

app.set("trust proxy", true);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

const port = process.env.PORT || 3000; // It's good practice to use the PORT from .env too

app.listen(port, () => {
  console.log(`Server listening on port ${port}!!!`);
});
