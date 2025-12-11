import fs from "node:fs";
import path from "node:path";

import { createRestClient } from "./scripts/restClient.js";
import { createGQLClient } from "./scripts/gqlClient.js";

const dbs = [
  {
    name: "MongoDB",
    rest: createRestClient("mongo", "_id"),
    gql: createGQLClient("mongo"),
    idField: "_id",
  },
  {
    name: "MariaDB",
    rest: createRestClient("maria", "id"),
    gql: createGQLClient("maria"),
    idField: "id",
  },
];

const logResult = (r) => {
  const msg = `${r.label} — Tempo: ${r.time.toFixed(2)}ms -- Size: ${
    r.size
  } bytes`;

  console.log(msg);
};

async function run() {
  const results = [];

  const push = (api, db, r) => {
    results.push({
      api,
      db,
      method: r.label,
      time: r.time,
      size: r.size,
      items: r.items,
    });
  };

  for (const db of dbs) {
    console.log(`\n🚀 ${db.name}`);

    // ------------------------------------------------ REST
    const before = await db.rest.list();
    const inserted = await db.rest.addMany(1000);
    const after = await db.rest.list();

    const newIds = after.data
      .map((u) => u[db.idField])
      .filter((id) => !before.ids.includes(id));

    const updated = await db.rest.updateMany(newIds);
    const deleted = await db.rest.deleteMany(newIds);

    console.log("\n=========== RESULTADOS REST ===========\n");
    for (const r of [before, inserted, updated, deleted]) {
      logResult(r);
      push("REST", db.name, r);
    }

    // ------------------------------------------------ GraphQL
    const gqlBefore = await db.gql.fetchMany();
    const gqlInserted = await db.gql.addMany(1000);
    const gqlAfter = await db.gql.fetchMany();

    const gqlNewIds = gqlAfter.data
      .map((u) => u.id)
      .filter((id) => !gqlBefore.data.some((x) => x.id == id));

    const gqlUpdated = await db.gql.updateMany(gqlNewIds);
    const gqlDeleted = await db.gql.deleteMany(gqlNewIds);

    console.log("\n=========== RESULTADOS GraphQL ===========\n");
    for (const r of [gqlBefore, gqlInserted, gqlUpdated, gqlDeleted]) {
      logResult(r);
      push("GraphQL", db.name, r);
    }
  }

  console.log("\n🔥 Teste finalizado com sucesso\n");
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
  console.log("📄 CSV gerado → benchmark.csv");
}

await run();
