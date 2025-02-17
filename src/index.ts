import { fetchTariffData } from "./api/fetchTariffData";
import insertOrUpdateTariffData from "./db/saveTariffData";
import * as schedule from "node-schedule";
import { exportToGoogleSheets } from "./googl-sheets/googleScheetsService";

async function main() {
  console.log("Starting WB Data Service");

  const urlData = require("../google_sheets_url.json");

  try {
    const tariffData = await fetchTariffData();
    await insertOrUpdateTariffData(tariffData);
    await exportToGoogleSheets(urlData.url);
  } catch (error) {
    console.error("Error running scheduled job:", error);
  }

  console.log("Setting up scheduler");
  schedule.scheduleJob("0 * * * *", async () => {
    console.log(`Running scheduled job at ${new Date().toString()}`);
  });
}

main();
