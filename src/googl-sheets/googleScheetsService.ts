import { google } from "googleapis";
import database from "../db/db";
import * as fs from "fs";
import { table } from "console";

const keyFilePath =
  process.env.GOOGLE_SHEETS_KEY_FILE || ".google_sheets_key.json";

export async function exportToGoogleSheets(sheetUrls: string[]) {
  console.log("Starting export to Google Sheets");

  const tariffValues = await getTariffs();

  const sheetsApi = googleSheetsService();

  for (const sheetUrl of sheetUrls) {
    const sheetId = parseSheetIdFromUrl(sheetUrl);

    await sheetsApi.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "stocks_coefs!A1:L1",
      valueInputOption: "RAW",
      requestBody: { values: tariffValues },
    });
  }

  console.log("Exported data to sheets");
}

async function getTariffs() {
  const tariffs = await database("warehouse_metrics")
    .join(
      "warehouse",
      "warehouse_metrics.warehouse_id",
      "warehouse.warehouse_id",
    )
    .join(
      "daily_snapshot",
      "warehouse_metrics.snapshot_id",
      "daily_snapshot.snapshot_id",
    )
    .orderBy("delivery_storage_expr", "asc");

  const values = tariffs.map((t: any) => [
    t.metrics_id,
    t.dt_next_box,
    t.dt_till_max,
    t.created_at,
    t.warehouse_name,
    t.delivery_storage_expr,
    t.delivery_base,
    t.delivery_liter,
    t.storage_base,
    t.storage_liter,
  ]);
  return values;
}

function googleSheetsService() {
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`The file ${keyFilePath} does not exist.`);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function parseSheetIdFromUrl(url: string): string {
  const match = url.match(/\/d\/([^\/]+)/);
  if (!match) {
    throw new Error(`Invalid Google Sheets URL: ${url}`);
  }
  return match[1];
}
