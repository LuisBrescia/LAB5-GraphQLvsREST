import fs from "node:fs";
import path from "node:path";

import { createRestClient } from "./scripts/restClient.js";
import { createGQLClient } from "./scripts/gqlClient.js";

const mariaREST = createRestClient("maria", "id");
const mongoREST = createRestClient("mongo", "_id");

const mariaGQL = createGQLClient("maria");
const mongoGQL = createGQLClient("mongo");

async function run() {
  console.log("\n🚀 MongoDB");

  const listBeforeMongo = await mongoREST.list();
  const insertedMongo = await mongoREST.addMany(1000);
  const listAfterInsertMongo = await mongoREST.list();

  const newIdsMongo = listAfterInsertMongo.data
    .map((u) => u._id)
    .filter((id) => !listBeforeMongo.ids.includes(id));
  const updatedMongo = await mongoREST.updateMany(newIdsMongo);
  const deletedMongo = await mongoREST.deleteMany(newIdsMongo);

  console.log("\n=========== RESULTADOS REST ===========\n");
  for (const r of [listBeforeMongo, insertedMongo, updatedMongo, deletedMongo])
    console.log(
      `${r.label} — Tempo: ${r.time.toFixed(2)}ms -- Size: ${r.size} bytes`
    );

  // ================= GraphQL ====================

  const gqlMongoBefore = await mongoGQL.fetchMany();
  const gqlMongoInserted = await mongoGQL.addMany(1000);
  const gqlMongoAfterInsert = await mongoGQL.fetchMany();

  const gqlMongoNewIds = gqlMongoAfterInsert.data
    .map((u) => u.id)
    .filter((id) => !gqlMongoBefore.data.some((x) => x.id == id));

  const gqlMongoUpdated = await mongoGQL.updateMany(gqlMongoNewIds);
  const gqlMongoDeleted = await mongoGQL.deleteMany(gqlMongoNewIds);

  console.log("\n=========== RESULTADOS GraphQL ===========\n");
  for (const r of [
    gqlMongoBefore,
    gqlMongoInserted,
    gqlMongoUpdated,
    gqlMongoDeleted,
  ]) {
    console.log(
      `${r.label} — Tempo: ${r.time.toFixed(2)}ms -- Size: ${r.size} bytes`
    );
  }

  console.log("\n🚀 MariaDB");

  const listBefore = await mariaREST.list();
  const inserted = await mariaREST.addMany(1000);
  const listAfterInsert = await mariaREST.list();

  const newIds = listAfterInsert.data
    .map((u) => u.id)
    .filter((id) => !listBefore.ids.includes(id));

  const updated = await mariaREST.updateMany(newIds);
  const deleted = await mariaREST.deleteMany(newIds);

  console.log("\n=========== RESULTADOS REST ===========\n");
  for (const r of [listBefore, inserted, updated, deleted])
    console.log(
      `${r.label} — Tempo: ${r.time.toFixed(2)}ms -- Size: ${r.size} bytes`
    );

  // ================= GraphQL ====================

  const gqlBefore = await mariaGQL.fetchMany();
  const gqlInserted = await mariaGQL.addMany(1000);
  const gqlAfterInsert = await mariaGQL.fetchMany();

  const gqlNewIds = gqlAfterInsert.data
    .map((u) => u.id)
    .filter((id) => !gqlBefore.data.some((x) => x.id == id));

  const gqlUpdated = await mariaGQL.updateMany(gqlNewIds);
  const gqlDeleted = await mariaGQL.deleteMany(gqlNewIds);

  console.log("\n=========== RESULTADOS GraphQL ===========\n");
  for (const r of [gqlBefore, gqlInserted, gqlUpdated, gqlDeleted])
    console.log(
      `${r.label} — Tempo: ${r.time.toFixed(2)}ms -- Size: ${r.size} bytes`
    );

  console.log("\n🔥 Teste finalizado com sucesso\n");

  const results = [
    {
      api: "REST",
      db: "MongoDB",
      method: listBeforeMongo.label,
      time: listBeforeMongo.time,
      size: listBeforeMongo.size,
      items: listBeforeMongo.items,
    },
    {
      api: "REST",
      db: "MongoDB",
      method: insertedMongo.label,
      time: insertedMongo.time,
      size: insertedMongo.size,
      items: insertedMongo.items,
    },
    {
      api: "REST",
      db: "MongoDB",
      method: updatedMongo.label,
      time: updatedMongo.time,
      size: updatedMongo.size,
      items: updatedMongo.items,
    },
    {
      api: "REST",
      db: "MongoDB",
      method: deletedMongo.label,
      time: deletedMongo.time,
      size: deletedMongo.size,
      items: deletedMongo.items,
    },
    {
      api: "GraphQL",
      db: "MongoDB",
      method: gqlMongoBefore.label,
      time: gqlMongoBefore.time,
      size: gqlMongoBefore.size,
      items: gqlMongoBefore.items,
    },
    {
      api: "GraphQL",
      db: "MongoDB",
      method: gqlMongoInserted.label,
      time: gqlMongoInserted.time,
      size: gqlMongoInserted.size,
      items: gqlMongoInserted.items,
    },
    {
      api: "GraphQL",
      db: "MongoDB",
      method: gqlMongoUpdated.label,
      time: gqlMongoUpdated.time,
      size: gqlMongoUpdated.size,
      items: gqlMongoUpdated.items,
    },
    {
      api: "GraphQL",
      db: "MongoDB",
      method: gqlMongoDeleted.label,
      time: gqlMongoDeleted.time,
      size: gqlMongoDeleted.size,
      items: gqlMongoDeleted.items,
    },
    {
      api: "REST",
      db: "MariaDB",
      method: listBefore.label,
      time: listBefore.time,
      size: listBefore.size,
      items: listBefore.items,
    },
    {
      api: "REST",
      db: "MariaDB",
      method: inserted.label,
      time: inserted.time,
      size: inserted.size,
      items: inserted.items,
    },
    {
      api: "REST",
      db: "MariaDB",
      method: updated.label,
      time: updated.time,
      size: updated.size,
      items: updated.items,
    },
    {
      api: "REST",
      db: "MariaDB",
      method: deleted.label,
      time: deleted.time,
      size: deleted.size,
      items: deleted.items,
    },
    {
      api: "GraphQL",
      db: "MariaDB",
      method: gqlBefore.label,
      time: gqlBefore.time,
      size: gqlBefore.size,
      items: gqlBefore.items,
    },
    {
      api: "GraphQL",
      db: "MariaDB",
      method: gqlInserted.label,
      time: gqlInserted.time,
      size: gqlInserted.size,
      items: gqlInserted.items,
    },
    {
      api: "GraphQL",
      db: "MariaDB",
      method: gqlUpdated.label,
      time: gqlUpdated.time,
      size: gqlUpdated.size,
      items: gqlUpdated.items,
    },
    {
      api: "GraphQL",
      db: "MariaDB",
      method: gqlDeleted.label,
      time: gqlDeleted.time,
      size: gqlDeleted.size,
      items: gqlDeleted.items,
    },
  ];

  saveCSV(results);
}

function saveCSV(results) {
  const file = path.join(process.cwd(), "benchmark.csv");

  const header = "api,banco,metodo,tempo(ms),tamanho,items\n";
  const rows = results
    .map(
      (r) =>
        `${r.api},${r.db},${r.method},${r.time.toFixed(2)},${r.size},${r.items}`
    )
    .join("\n");

  fs.writeFileSync(file, header + rows);
  console.log(`📄 CSV gerado → benchmark.csv`);
}

await run();
