import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const knexConfig = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || "5432",
    database: process.env.POSTGRES_DB || "postgres",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
  },
  migrations: {
    directory: "./migrations",
    tableName: "knex_migrations",
  },
};

const database = require("knex")(knexConfig);

database.migrate
  .latest()
  .then(() => {
    console.log("Migrations completed successfully");
  })
  .catch((error: any) => {
    throw error;
  });

export default database;
