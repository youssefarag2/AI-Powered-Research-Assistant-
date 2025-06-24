import { google } from "googleapis";

export function getGoogleOAuthClient() {
  return new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    "http://localhost:3000/auth/drive/callback"
  );
}
