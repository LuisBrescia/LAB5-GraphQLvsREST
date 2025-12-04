import {
  listUsers,
  addManyUsers,
  updateMany,
  deleteMany,
} from "./scripts/restMariaClient.js";

import {
  fetchMariaGQL,
  postMariaGQL,
  putMariaGQL,
  deleteMariaGQL,
} from "./scripts/gqlMariaClient.js";

async function addManyMariaGQL(count = 1000) {
  const users = Array.from({ length: count }, (_, i) => ({
    name: `MariaGQL_${Date.now()}_${i}`,
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  for (const u of users) await postMariaGQL(u);
  const end = performance.now();

  return {
    label: `MariaDB GraphQL INSERT x${count}`,
    time: end - start,
    size: JSON.stringify(users).length,
    ids: [], // será usado depois
  };
}

async function updateManyMariaGQL(ids) {
  const start = performance.now();
  for (const id of ids) {
    await putMariaGQL({
      id,
      name: "Updated_GQL",
      age: Math.floor(Math.random() * 50),
    });
  }
  const end = performance.now();

  return {
    label: `MariaDB GraphQL UPDATE x${ids.length}`,
    time: end - start,
    size: "-",
  };
}

async function deleteManyMariaGQL(ids) {
  const start = performance.now();
  for (const id of ids) await deleteMariaGQL(id);
  const end = performance.now();

  return {
    label: `MariaDB GraphQL DELETE x${ids.length}`,
    time: end - start,
    size: "-",
  };
}

async function run() {
  console.log("\n🚀 Teste de Performance - REST MariaDB");

  const listBefore = await listUsers();
  const inserted = await addManyUsers();
  const listAfterInsert = await listUsers();

  const newIds = listAfterInsert.data
    .map((u) => u.id)
    .filter((id) => !listBefore.ids.includes(id));

  const updated = await updateMany(newIds);
  const deleted = await deleteMany(newIds);

  console.log("\n=========== RESULTADOS REST ===========\n");
  for (const r of [listBefore, inserted, updated, deleted])
    console.log(
      `${r.label} — Tempo: ${r.time.toFixed(2)}ms | Size: ${
        r.size || "-"
      } bytes`
    );

  // ================= GraphQL ====================
  console.log("\n⚡ Teste GraphQL MariaDB");

  const gqlBefore = await fetchMariaGQL();
  const gqlInserted = await addManyMariaGQL(500); // 🔥 pode ajustar o volume
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
}

await run();
