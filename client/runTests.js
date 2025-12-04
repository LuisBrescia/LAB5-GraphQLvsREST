import { fetchMongoRest, fetchMariaRest } from "./scripts/restClient.js";
import { fetchMongoGQL, fetchMariaGQL } from "./scripts/gqlClient.js";

async function run() {
  console.log("🚀 Testando performance...\n");

  const results = [
    await fetchMongoRest(),
    await fetchMongoGQL(),
    await fetchMariaRest(),
    await fetchMariaGQL(),
  ];

  console.log("========== RESULTADOS ==========\n");

  for (const result of results) {
    console.log(`${result.label}:`);
    console.log(`⌚ Tempo:  ${result.time.toFixed(2)} ms`);
    console.log(`📦 Tamanho: ${result.size} bytes\n`);
  }
}

await run();
