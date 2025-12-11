import fs from "node:fs";
import path from "node:path";

import { createRestClient } from "./scripts/restClient.js";
import { createGQLClient } from "./scripts/gqlClient.js";

// interface Result {
//   label: string;
//   time: number;
//   size: number;
//   ids?: string[];
// }

const SIZES = [100, 500, 1_000];

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
  {
    name: "Redis",
    rest: createRestClient("redis", "id"),
    gql: createGQLClient("redis"),
    idField: "id",
  },
];

const logResult = (r) => {
  const msg = `
  ${r.label} 
  -- Tempo: ${r.time.toFixed(2)}ms -- Items: ${r.items} -- Size: ${r.size} bytes
  `;

  console.log(msg);
};

async function run(count) {
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

    // * Rest
    const inserted = await db.rest.addMany(count);
    const list = await db.rest.list();

    const newIds = list.data.map((u) => u[db.idField]);

    const updated = await db.rest.updateMany(newIds);
    const deleted = await db.rest.deleteMany(newIds);

    console.log("\n=========== RESULTADOS REST ===========\n");
    for (const r of [inserted, list, updated, deleted]) {
      logResult(r);
      push("REST", db.name, r);
    }

    // * GraphQL
    const gqlInserted = await db.gql.addMany(count);
    const gqlList = await db.gql.fetchMany();

    const gqlNewIds = gqlList.data.map((u) => u.id);

    const gqlUpdated = await db.gql.updateMany(gqlNewIds);
    const gqlDeleted = await db.gql.deleteMany(gqlNewIds);

    console.log("\n=========== RESULTADOS GraphQL ===========\n");
    for (const r of [gqlInserted, gqlList, gqlUpdated, gqlDeleted]) {
      logResult(r);
      push("GraphQL", db.name, r);
    }
  }

  saveCSV(results, count);
}

function saveCSV(results, count) {
  const file = path.join(process.cwd(), `benchmark_${count}_items.csv`);

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

for (const size of SIZES) {
  console.log(`\n=== Rodando benchmark com ${size} items ===`);
  await run(size);
}
