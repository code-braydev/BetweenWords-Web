import { google } from 'googleapis';

export const useSheets = () => {
  const config = useRuntimeConfig();

  const getAuth = () => {
    const privateKey = config.firebasePrivateKey?.replace(/\\n/g, '\n');
    
    return new google.auth.JWT(
      config.firebaseClientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
  };

  const extractSheetId = (url: string) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const appendRow = async (sheetUrl: string, rowData: any[]) => {
    const spreadsheetId = extractSheetId(sheetUrl);
    if (!spreadsheetId) throw new Error('Invalid Google Sheets URL');

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Append the data to the first sheet (Sheet1)
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });
  };

  return {
    appendRow,
    extractSheetId
  };
};
