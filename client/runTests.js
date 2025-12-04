import fs from "fs";
import path from "path";

import {
  listUsers,
  addManyUsers,
  updateMany,
  deleteMany,
} from "./scripts/restMariaClient.js";

import {
  fetchMariaGQL,
  addManyMariaGQL,
  updateManyMariaGQL,
  deleteManyMariaGQL,
} from "./scripts/gqlMariaClient.js";

async function run() {
  console.log("\n🚀 Teste de Performance - REST MariaDB");

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
  console.log("\n⚡ Teste GraphQL MariaDB");

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
  const file = path.join(process.cwd(), "benchmark_maria.csv");

  const header = "api,banco,metodo,tempo(ms)\n";
  const rows = results
    .map((r) => `${r.api},${r.db},${r.method},${r.time.toFixed(2)}`)
    .join("\n");

  fs.writeFileSync(file, header + rows);
  console.log(`📄 CSV gerado → benchmark_maria.csv`);
}

await run();
