import { useSheets } from '~~/server/utils/sheets';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { sheetUrl, name, group, score, total, details } = body;

  if (!sheetUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Sheet URL is required',
    });
  }

  const { appendRow } = useSheets();

  try {
    const timestamp = new Date().toLocaleString();
    const rowData = [timestamp, name, group, score, total, JSON.stringify(details)];
    
    await appendRow(sheetUrl, rowData);

    return {
      success: true,
      message: 'Grade recorded successfully'
    };
  } catch (error: any) {
    console.error('Error writing to Google Sheets:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to record grade: ' + error.message,
    });
  }
});
