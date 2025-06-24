import { getGoogleOAuthClient } from "../services/googleClient.js";
import { google } from "googleapis";
import User from "../models/User.js";

const scopes = [
  "https://www.googleapis.com/auth/drive.readonly",
  "openid",
  "email",
  "profile",
];

export const connectDrive = (req, res) => {
  const oauth2Client = getGoogleOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  res.redirect(url);
};

export const handleDriveCallback = async (req, res) => {
  const oauth2Client = getGoogleOAuthClient();
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Get user info using token
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  // Update user in DB
  await User.findOneAndUpdate(
    { email: data.email },
    {
      driveAccessToken: tokens.access_token,
      driveRefreshToken: tokens.refresh_token,
      $addToSet: { connectedServices: "googleDrive" },
    },
    { new: true, upsert: true }
  );

  res.redirect("/"); // or to your frontend
};

export const listDriveFiles = async (req, res) => {
  const userEmail = res.locals.session?.user?.email;

  if (!userEmail) return res.status(400).json({ error: "Not authenticated" });

  const user = await User.findOne({ email: userEmail });

  if (!user || !user.driveAccessToken) {
    return res.status(401).json({ error: "Drive not connected" });
  }

  const oauth2Client = getGoogleOAuthClient();

  // Restore credentials from DB
  oauth2Client.setCredentials({
    access_token: user.driveAccessToken,
    refresh_token: user.driveRefreshToken,
  });

  try {
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.files.list({
      pageSize: 10,
      fields: "files(id, name, mimeType, modifiedTime)",
    });

    res.json(response.data.files);
  } catch (error) {
    console.error("Error listing drive files:", error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Unauthorized - token expired" });
    }

    res.status(500).json({ error: "Failed to access Google Drive" });
  }
};
