import database from "../db/db";
import insertOrUpdateTariffData from "../db/saveTariffData";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const tariffUrl = `${process.env.WB_ENDPOINT}?date=${new Date().toISOString().split("T")[0]}`;
const authorizationHeader = {
  Authorization: `Bearer ${process.env.WB_API_KEY}`,
};

export async function fetchTariffData() {
  console.log("Fetching tariff data from WB endpoint");

  return fetch(tariffUrl, {
    headers: authorizationHeader,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success fetching from WB endpoint");
      return data;
    })
    .catch((error) => {
      console.error("Error fetching from WB endpoint:", error);
      throw error;
    });
}
