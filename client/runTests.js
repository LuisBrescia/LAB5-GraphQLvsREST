import { fetchUsersRest } from "./scripts/restClient.js";
import { fetchUsersGraphQL } from "./scripts/gqlClient.js";

async function run() {
  console.log("🔵 Rodando teste REST...");
  const rest = await fetchUsersRest();

  console.log("🟣 Rodando teste GraphQL...");
  const gql = await fetchUsersGraphQL();

  console.log("========== RESULTADOS ==========");

  console.log("REST:");
  console.log(`Tempo: ${rest.time.toFixed(2)} ms`);
  console.log(`Tamanho: ${rest.size} bytes`);

  console.log("");

  console.log("GraphQL:");
  console.log(`Tempo: ${gql.time.toFixed(2)} ms`);
  console.log(`Tamanho: ${gql.size} bytes`);
}

await run();
