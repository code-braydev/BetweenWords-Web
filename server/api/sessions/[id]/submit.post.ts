import { useSheets } from "~~/server/utils/google-sheets";

export default defineEventHandler(async (event) => {
  // ── 1. Validate session id from URL ───────────────────────────────────
  const sessionId = getRouterParam(event, "id");
  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: "Session ID is required" });
  }

  // ── 2. Read & validate body ───────────────────────────────────────────
  const body = await readBody(event);
  const { sheetUrl, name, score } = body ?? {};

  if (!sheetUrl || typeof sheetUrl !== "string" || !sheetUrl.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "sheetUrl is required and must be a valid Google Sheets URL",
    });
  }

  // ── 3. Validate runtime config (detect missing credentials early) ──────
  const config = useRuntimeConfig(event);
  const privateKey = (config.firebasePrivateKey as string | undefined)?.replace(/\\n/g, "\n");
  const clientEmail = config.firebaseClientEmail as string | undefined;

  if (!privateKey || privateKey.trim() === "") {
    console.error("[submit] PRIVATE_KEY is missing or empty. Check FIREBASE_PRIVATE_KEY env var.");
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: missing Google service account private key.",
    });
  }

  if (!clientEmail || !clientEmail.includes("@")) {
    console.error("[submit] CLIENT_EMAIL is missing or invalid. Check FIREBASE_CLIENT_EMAIL env var.");
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: missing Google service account email.",
    });
  }

  // ── 4. Extract spreadsheet ID to validate URL before calling API ───────
  const { extractSheetId, appendRow } = useSheets();
  const spreadsheetId = extractSheetId(sheetUrl);

  if (!spreadsheetId) {
    console.error("[submit] Could not extract spreadsheetId from URL:", sheetUrl);
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Google Sheets URL. Expected format: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/...",
    });
  }

  // ── 5. Build row data ──────────────────────────────────────────────────
  const timestamp = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
  const rowData = [
    timestamp,
    name ?? "—",
    score ?? 0,
  ];

  // ── 6. Append row with categorized error handling ──────────────────────
  try {
    await appendRow(sheetUrl, rowData);

    console.info(`[submit] ✅ Grade recorded for session=${sessionId} name="${name}" score=${score}`);

    return {
      success: true,
      message: "Grade recorded successfully",
      sessionId,
    };
  } catch (error: any) {
    const message: string = error?.message ?? String(error);
    const statusCode: number = error?.code ?? error?.status ?? 500;

    // ── Categorize common Google API errors ──────────────────────────────
    if (message.includes("invalid_grant") || message.includes("DECODER routines")) {
      console.error("[submit] ❌ Auth error – PRIVATE_KEY is malformed or the service account is not authorized:", message);
      throw createError({
        statusCode: 403,
        statusMessage: "Google Sheets auth failed: invalid credentials or private key format. Verify FIREBASE_PRIVATE_KEY in .env (escape \\n as literal \\\\n).",
      });
    }

    if (message.includes("forbidden") || statusCode === 403) {
      console.error("[submit] ❌ Permission denied – the service account does not have write access to the spreadsheet:", spreadsheetId, message);
      throw createError({
        statusCode: 403,
        statusMessage: `Permission denied: share the spreadsheet (${spreadsheetId}) with the service account email (${clientEmail}) as an Editor.`,
      });
    }

    if (message.includes("not found") || statusCode === 404) {
      console.error("[submit] ❌ Spreadsheet not found – check spreadsheetId:", spreadsheetId);
      throw createError({
        statusCode: 404,
        statusMessage: `Spreadsheet not found (id=${spreadsheetId}). Verify the sheetUrl stored in the session.`,
      });
    }

    // Generic fallback
    console.error("[submit] ❌ Unexpected error writing to Google Sheets:", message, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to record grade: ${message}`,
    });
  }
});
