import express from "express";

import {
  connectDrive,
  handleDriveCallback,
  listDriveFiles,
} from "../controllers/driveController.js";

const router = express.Router();

router.get("/auth/drive", connectDrive);
router.get("/auth/drive/callback", handleDriveCallback);
router.get("/drive/files", listDriveFiles);

export default router;
