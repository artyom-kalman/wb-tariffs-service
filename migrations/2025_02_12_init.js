exports.up = function (knex) {
  return knex.schema
    .createTable("daily_snapshot", (table) => {
      table.increments("snapshot_id").primary();
      table.date("dt_next_box");
      table.date("dt_till_max");
      table.date("created_at").defaultTo(knex.fn.now()).unique();
    })
    .createTable("warehouse", (table) => {
      table.increments("warehouse_id").primary();
      table.string("warehouse_name", 255).notNullable().unique();
    })
    .createTable("warehouse_metrics", (table) => {
      table.increments("metrics_id").primary();
      table.integer("snapshot_id").unsigned().notNullable();
      table.integer("warehouse_id").unsigned().notNullable();
      table.float("delivery_storage_expr", 10, 2);
      table.float("delivery_base", 10, 2);
      table.float("delivery_liter", 10, 2);
      table.float("storage_base", 10, 2);
      table.float("storage_liter", 10, 2);

      table
        .foreign("snapshot_id")
        .references("snapshot_id")
        .inTable("daily_snapshot")
        .onDelete("CASCADE");
      table
        .foreign("warehouse_id")
        .references("warehouse_id")
        .inTable("warehouse")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("warehouse_metrics")
    .dropTableIfExists("warehouse")
    .dropTableIfExists("daily_snapshot");
};
