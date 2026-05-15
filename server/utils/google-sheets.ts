import { google } from "googleapis";

export const useSheets = () => {
  const config = useRuntimeConfig();

  /**
   * Build a JWT auth client using service account credentials.
   * Supports both FIREBASE_PRIVATE_KEY (with literal \n) and
   * PEM-encoded keys already containing newlines.
   */
  const getAuth = () => {
    // Prefer GOOGLE_PRIVATE_KEY, fall back to FIREBASE_PRIVATE_KEY
    const rawKey =
      (config.googlePrivateKey as string | undefined) ??
      (config.firebasePrivateKey as string | undefined) ??
      "";

    // Handle both literal \\n (from .env JSON escaping) and actual \n
    const privateKey = rawKey.includes("\\n")
      ? rawKey.replace(/\\n/g, "\n")
      : rawKey;

    const clientEmail =
      (config.googleClientEmail as string | undefined) ??
      (config.firebaseClientEmail as string | undefined) ??
      "";

    if (!privateKey || !clientEmail) {
      throw new Error(
        "Missing Google service account credentials. " +
          "Set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL (or GOOGLE_ variants) in your .env file.",
      );
    }

    return new google.auth.JWT(clientEmail, undefined, privateKey, [
      "https://www.googleapis.com/auth/spreadsheets",
    ]);
  };

  /**
   * Extract the spreadsheet ID from a Google Sheets URL.
   * Handles both /edit and /view variants.
   */
  const extractSheetId = (url: string): string | null => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match?.[1] ?? null;
  };

  /**
   * Append a row to the first sheet of the given Google Sheets URL.
   * The range "Sheet1" causes the API to find the first available
   * empty row automatically.
   */
  const appendRow = async (sheetUrl: string, rowData: unknown[]) => {
    const spreadsheetId = extractSheetId(sheetUrl);
    if (!spreadsheetId) {
      throw new Error(`Invalid Google Sheets URL: ${sheetUrl}`);
    }

    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Resultados!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowData],
      },
    });
  };

  return {
    appendRow,
    extractSheetId,
  };
};
