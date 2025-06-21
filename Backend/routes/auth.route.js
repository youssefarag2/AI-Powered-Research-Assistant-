import express from "express";
import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";

const router = express.Router();

router.use(
  "/",
  ExpressAuth({
    providers: [Google],
  })
);

export default router;
