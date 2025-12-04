import mysql from "mysql2/promise";

export async function connectMariaDB() {
  return mysql.createPool({
    host: "localhost",
    user: "experiment",
    password: "experiment",
    database: "experimentdb",
  });
}
