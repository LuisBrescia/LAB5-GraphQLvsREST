import fs from "node:fs";
import path from "node:path";

import { createRestClient } from "./scripts/restClient.js";
import { createGQLClient } from "./scripts/gqlClient.js";

const RUNS = 100; // quantas vezes cada benchmark será executado
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

// ------------------------------------------------
// Função antiga, agora isolada: roda 1 benchmark
// ------------------------------------------------
async function runSingle(count) {
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

    // REST
    const inserted = await db.rest.addMany(count);
    const list = await db.rest.list();
    const newIds = list.data.map((u) => u[db.idField]);

    const updated = await db.rest.updateMany(newIds);
    const deleted = await db.rest.deleteMany(newIds);

    for (const r of [inserted, list, updated, deleted]) {
      push("REST", db.name, r);
    }

    // GraphQL
    const gqlInserted = await db.gql.addMany(count);
    const gqlList = await db.gql.fetchMany();

    const gqlNewIds = gqlList.data.map((u) => u.id);

    const gqlUpdated = await db.gql.updateMany(gqlNewIds);
    const gqlDeleted = await db.gql.deleteMany(gqlNewIds);

    for (const r of [gqlInserted, gqlList, gqlUpdated, gqlDeleted]) {
      push("GraphQL", db.name, r);
    }
  }

  return results;
}

// ------------------------------------------------
// Média de todas execuções
// ------------------------------------------------
function averageResults(runs) {
  const flat = runs.flat();

  const groups = {};

  for (const r of flat) {
    const key = `${r.api}|${r.db}|${r.method}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }

  const averaged = [];

  for (const [key, items] of Object.entries(groups)) {
    const [api, db, method] = key.split("|");

    const avg = (field) =>
      items.reduce((acc, x) => acc + x[field], 0) / items.length;

    averaged.push({
      api,
      db,
      method,
      time: avg("time"),
      size: avg("size"),
      items: items[0].items,
    });
  }

  return averaged;
}

// ------------------------------------------------
// Loop principal para cada tamanho
// ------------------------------------------------
async function runAll(count) {
  const all = [];

  for (let i = 0; i < RUNS; i++) {
    console.log(`\n▶ Execução ${i + 1}/${RUNS} para ${count} items`);
    const res = await runSingle(count);
    all.push(res);
  }

  const averaged = averageResults(all);
  saveCSV(averaged, count);
}

// ------------------------------------------------
// Salva CSV com a média final
// ------------------------------------------------
function saveCSV(results, count) {
  const file = path.join(process.cwd(), `benchmark_${count}_items.csv`);

  const header = "api,banco,metodo,tempo(ms),tamanho,items\n";
  const rows = results
    .map(
      (r) =>
        `${r.api},${r.db},${r.method},${r.time.toFixed(2)},${r.size.toFixed(
          0
        )},${r.items}`
    )
    .join("\n");

  fs.writeFileSync(file, header + rows);
  console.log(`📄 CSV gerado → benchmark_${count}_items.csv`);
}

// -----------------------------------------------
// Execução final
// -----------------------------------------------
for (const size of SIZES) {
  console.log(`\n=== Rodando média (${RUNS} execuções) com ${size} items ===`);
  await runAll(size);
}
