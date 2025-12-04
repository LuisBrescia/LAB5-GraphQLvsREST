import {
  listUsers,
  addManyUsers,
  updateMany,
  deleteMany,
} from "./scripts/restMariaClient.js";

async function run() {
  console.log("\n🚀 Teste de Performance - REST MariaDB\n");

  const listBefore = await listUsers();
  const inserted = await addManyUsers();
  const listAfterInsert = await listUsers();

  // apenas atualiza os novos
  const newIds = listAfterInsert.data
    .map((u) => u.id)
    .filter((id) => !listBefore.ids.includes(id));

  const updated = await updateMany(newIds);
  const deleted = await deleteMany(newIds);

  console.log("\n=========== RESULTADOS ===========\n");
  for (const r of [listBefore, inserted, updated, deleted])
    console.log(
      `${r.label} — Tempo: ${r.time.toFixed(2)}ms | Size: ${
        r.size || "-"
      } bytes`
    );

  console.log("\n🔥 Teste finalizado com sucesso\n");
}

await run();
