import { google } from "googleapis";

/**
 * Appends a row to the given tab of the Guild Shop submissions spreadsheet.
 * Credentials come from env vars (never committed — see .env.local locally,
 * Vercel project settings in production).
 */
export async function appendRow(sheetName: string, row: (string | number)[]) {
  // .trim() guards against stray whitespace/newlines picked up when pasting
  // values into Vercel's env var UI (a trailing "\n" turns a valid ID into
  // one Google can't find).
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.trim().replace(/\\n/g, "\n");

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error("Google Sheets credentials are not configured");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
