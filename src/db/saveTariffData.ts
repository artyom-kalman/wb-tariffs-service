import { warn } from "console";
import database from "./db";

async function insertOrUpdateTariffData(data: any) {
  console.log("Inserting data to database...");

  const { dtNextBox, dtTillMax, warehouseList } = data.response.data;

  const snapshotId = await insertOrUpdateDailySnapshot(dtNextBox, dtTillMax);

  await insertOrUpdateWarehouseMetrics(warehouseList, snapshotId);

  console.log("Data inserted successfully");
}

async function insertOrUpdateDailySnapshot(
  dtNextBox: string,
  dtTillMax: string,
) {
  const [snapshot] = await database("daily_snapshot")
    .insert({
      dt_next_box: dtNextBox === "" ? null : dtNextBox,
      dt_till_max: dtTillMax === "" ? null : dtTillMax,
    })
    .onConflict("created_at")
    .merge()
    .returning("*");

  return snapshot.snapshot_id;
}

async function insertOrUpdateWarehouseMetrics(
  warehouseList: any,
  snapshotId: string,
) {
  for (const warehouseData of warehouseList) {
    const deliveryStorageExpr = changeFloatForPg(
      warehouseData.boxDeliveryAndStorageExpr,
    );
    const deliveryBase = changeFloatForPg(warehouseData.boxDeliveryBase);
    const deliveryLiter = changeFloatForPg(warehouseData.boxDeliveryLiter);
    const storageBase = changeFloatForPg(warehouseData.boxStorageBase);
    const storageLiter = changeFloatForPg(warehouseData.boxStorageLiter);

    const [warehouse] = await database("warehouse")
      .insert({ warehouse_name: warehouseData.warehouseName })
      .onConflict("warehouse_name")
      .merge()
      .returning("*");

    await database("warehouse_metrics")
      .select("*")
      .where({ warehouse_id: warehouse.warehouse_id, snapshot_id: snapshotId })
      .then(async (rows: any) => {
        if (rows.length > 0) {
          await database("warehouse_metrics")
            .update({
              delivery_storage_expr: deliveryStorageExpr,
              delivery_base: deliveryBase,
              delivery_liter: deliveryLiter,
              storage_base: storageBase,
              storage_liter: storageLiter,
            })
            .where({
              warehouse_id: warehouse.warehouse_id,
              snapshot_id: snapshotId,
            });
        } else {
          await database("warehouse_metrics").insert({
            snapshot_id: snapshotId,
            warehouse_id: warehouse.warehouse_id,
            delivery_storage_expr: deliveryStorageExpr,
            delivery_base: deliveryBase,
            delivery_liter: deliveryLiter,
            storage_base: storageBase,
            storage_liter: storageLiter,
          });
        }
      });
  }
}

function changeFloatForPg(value: string): number {
  return parseFloat(value.replace(",", "."));
}

export default insertOrUpdateTariffData;
