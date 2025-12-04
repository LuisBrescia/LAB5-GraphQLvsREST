import fs from "fs";
import path from "path";

import {
  listUsers,
  addManyUsers,
  updateMany,
  deleteMany,
} from "./scripts/restMariaClient.js";

import {
  listMongoUsers,
  addManyMongo,
  updateManyMongo,
  deleteManyMongo,
} from "./scripts/restMongoClient.js";

import {
  fetchMariaGQL,
  addManyMariaGQL,
  updateManyMariaGQL,
  deleteManyMariaGQL,
} from "./scripts/gqlMariaClient.js";

import {
  fetchMongoGQL,
  addManyMongoGQL,
  updateManyMongoGQL,
  deleteManyMongoGQL,
} from "./scripts/gqlMongoClient.js";

async function run() {
  console.log("\n🚀 MongoDB");

  const listBeforeMongo = await listMongoUsers();
  const insertedMongo = await addManyMongo(1000);
  const listAfterInsertMongo = await listMongoUsers();

  const newIdsMongo = listAfterInsertMongo.data
    .map((u) => u._id)
    .filter((id) => !listBeforeMongo.ids.includes(id));
  const updatedMongo = await updateManyMongo(newIdsMongo);
  const deletedMongo = await deleteManyMongo(newIdsMongo);

  console.log("\n=========== RESULTADOS REST ===========\n");
  for (const r of [listBeforeMongo, insertedMongo, updatedMongo, deletedMongo])
    console.log(`${r.label} — Tempo: ${r.time.toFixed(2)}ms`);

  // ================= GraphQL ====================

  const gqlMongoBefore = await fetchMongoGQL();
  const gqlMongoInserted = await addManyMongoGQL(1000);
  const gqlMongoAfterInsert = await fetchMongoGQL();

  const gqlMongoNewIds = gqlMongoAfterInsert.data
    .map((u) => u.id)
    .filter((id) => !gqlMongoBefore.data.some((x) => x.id == id));

  const gqlMongoUpdated = await updateManyMongoGQL(gqlMongoNewIds);
  const gqlMongoDeleted = await deleteManyMongoGQL(gqlMongoNewIds);

  console.log("\n=========== RESULTADOS GraphQL ===========\n");
  for (const r of [
    gqlMongoBefore,
    gqlMongoInserted,
    gqlMongoUpdated,
    gqlMongoDeleted,
  ]) {
    console.log(`${r.label} — Tempo: ${r.time.toFixed(2)}ms`);
  }

  console.log("\n🚀 MariaDB");

  const listBefore = await listUsers();
  const inserted = await addManyUsers(1000);
  const listAfterInsert = await listUsers();

  const newIds = listAfterInsert.data
    .map((u) => u.id)
    .filter((id) => !listBefore.ids.includes(id));

  const updated = await updateMany(newIds);
  const deleted = await deleteMany(newIds);

  console.log("\n=========== RESULTADOS REST ===========\n");
  for (const r of [listBefore, inserted, updated, deleted])
    console.log(`${r.label} — Tempo: ${r.time.toFixed(2)}ms`);

  // ================= GraphQL ====================

  const gqlBefore = await fetchMariaGQL();
  const gqlInserted = await addManyMariaGQL(1000);
  const gqlAfterInsert = await fetchMariaGQL();

  const gqlNewIds = gqlAfterInsert.data
    .map((u) => u.id)
    .filter((id) => !gqlBefore.data.some((x) => x.id == id));

  const gqlUpdated = await updateManyMariaGQL(gqlNewIds);
  const gqlDeleted = await deleteManyMariaGQL(gqlNewIds);

  console.log("\n=========== RESULTADOS GraphQL ===========\n");
  for (const r of [gqlBefore, gqlInserted, gqlUpdated, gqlDeleted])
    console.log(`${r.label} — Tempo: ${r.time.toFixed(2)}ms`);

  console.log("\n🔥 Teste finalizado com sucesso\n");

  const results = [
    {
      api: "REST",
      db: "MongoDB",
      method: listBeforeMongo.label,
      time: listBeforeMongo.time,
    },
    {
      api: "REST",
      db: "MongoDB",
      method: insertedMongo.label,
      time: insertedMongo.time,
    },
    {
      api: "REST",
      db: "MongoDB",
      method: updatedMongo.label,
      time: updatedMongo.time,
    },
    {
      api: "REST",
      db: "MongoDB",
      method: deletedMongo.label,
      time: deletedMongo.time,
    },
    {
      api: "GraphQL",
      db: "MongoDB",
      method: gqlMongoBefore.label,
      time: gqlMongoBefore.time,
    },
    {
      api: "GraphQL",
      db: "MongoDB",
      method: gqlMongoInserted.label,
      time: gqlMongoInserted.time,
    },
    {
      api: "GraphQL",
      db: "MongoDB",
      method: gqlMongoUpdated.label,
      time: gqlMongoUpdated.time,
    },
    {
      api: "GraphQL",
      db: "MongoDB",
      method: gqlMongoDeleted.label,
      time: gqlMongoDeleted.time,
    },
    {
      api: "REST",
      db: "MariaDB",
      method: listBefore.label,
      time: listBefore.time,
    },
    { api: "REST", db: "MariaDB", method: inserted.label, time: inserted.time },
    { api: "REST", db: "MariaDB", method: updated.label, time: updated.time },
    { api: "REST", db: "MariaDB", method: deleted.label, time: deleted.time },

    {
      api: "GraphQL",
      db: "MariaDB",
      method: gqlBefore.label,
      time: gqlBefore.time,
    },
    {
      api: "GraphQL",
      db: "MariaDB",
      method: gqlInserted.label,
      time: gqlInserted.time,
    },
    {
      api: "GraphQL",
      db: "MariaDB",
      method: gqlUpdated.label,
      time: gqlUpdated.time,
    },
    {
      api: "GraphQL",
      db: "MariaDB",
      method: gqlDeleted.label,
      time: gqlDeleted.time,
    },
  ];

  saveCSV(results);
}

function saveCSV(results) {
  const file = path.join(process.cwd(), "benchmark.csv");

  const header = "api,banco,metodo,tempo(ms)\n";
  const rows = results
    .map((r) => `${r.api},${r.db},${r.method},${r.time.toFixed(2)}`)
    .join("\n");

  fs.writeFileSync(file, header + rows);
  console.log(`📄 CSV gerado → benchmark.csv`);
}

await run();
