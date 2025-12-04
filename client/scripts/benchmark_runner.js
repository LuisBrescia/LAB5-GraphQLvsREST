import fs from "fs";
import path from "path";
import { runRestTrial } from "./restMariaClient.js";
import {
  fetchMariaGQL,
  addManyMariaGQL,
  updateManyMariaGQL,
  deleteManyMariaGQL,
} from "./gqlMariaClient.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { trials: 30, batch: 1000, outFile: "benchmark_full.csv", delay: 200 };
  for (const a of args) {
    if (a.startsWith("--trials=")) out.trials = Number(a.split("=")[1]);
    if (a.startsWith("--batch=")) out.batch = Number(a.split("=")[1]);
    if (a.startsWith("--out=")) out.outFile = a.split("=")[1];
    if (a.startsWith("--delay=")) out.delay = Number(a.split("=")[1]);
  }
  return out;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const { trials, batch, outFile, delay } = parseArgs();
  console.log(`🚀 Benchmark runner starting: trials=${trials}, batch=${batch}`);

  const rows = [];
  rows.push("api,db,method,count,trial,time_ms,size_bytes");

  for (let t = 1; t <= trials; t++) {
    console.log(`\n--- Trial ${t}/${trials} — REST ---`);
    try {
      const restResults = await runRestTrial(t, batch);
      for (const r of restResults) {
        rows.push(
          `${r.api},${r.db},"${r.method}",${r.count},${r.trial},${r.time},${r.size}`
        );
        console.log(`${r.api} ${r.method} — ${r.time}ms (size=${r.size})`);
      }
    } catch (err) {
      console.error("REST trial failed:", err.message || err);
    }

    await sleep(delay);

    console.log(`\n--- Trial ${t}/${trials} — GraphQL ---`);
    try {
      const gqlBefore = await fetchMariaGQL();
      const gqlInserted = await addManyMariaGQL(batch);
      const gqlAfterInsert = await fetchMariaGQL();

      const beforeIds = new Set(gqlBefore.data.map((d) => d.id));
      const newIds = gqlAfterInsert.data.map((u) => u.id).filter((id) => !beforeIds.has(id));

      let idsToUse = newIds;
      if (idsToUse.length === 0) {
        idsToUse = gqlAfterInsert.data.slice(-batch).map((d) => d.id);
      }

      const gqlUpdated = await updateManyMariaGQL(idsToUse);
      const gqlDeleted = await deleteManyMariaGQL(idsToUse);

      const gqlRows = [
        {
          api: "GraphQL",
          db: "MariaDB",
          method: gqlBefore.label,
          count: gqlBefore.data.length,
          trial: t,
          time: Number(gqlBefore.time.toFixed(3)),
          size: gqlBefore.size,
        },
        {
          api: "GraphQL",
          db: "MariaDB",
          method: gqlInserted.label,
          count: batch,
          trial: t,
          time: Number(gqlInserted.time.toFixed(3)),
          size: gqlInserted.size,
        },
        {
          api: "GraphQL",
          db: "MariaDB",
          method: gqlUpdated.label,
          count: idsToUse.length,
          trial: t,
          time: Number(gqlUpdated.time.toFixed(3)),
          size: gqlUpdated.size ?? 0,
        },
        {
          api: "GraphQL",
          db: "MariaDB",
          method: gqlDeleted.label,
          count: idsToUse.length,
          trial: t,
          time: Number(gqlDeleted.time.toFixed(3)),
          size: gqlDeleted.size ?? 0,
        },
      ];

      for (const r of gqlRows) {
        rows.push(
          `${r.api},${r.db},"${r.method}",${r.count},${r.trial},${r.time},${r.size}`
        );
        console.log(`${r.api} ${r.method} — ${r.time}ms (size=${r.size})`);
      }
    } catch (err) {
      console.error("GraphQL trial failed:", err.message || err);
    }

    await sleep(delay);
  }

  const outPath = path.join(process.cwd(), outFile);
  fs.writeFileSync(outPath, rows.join("\n"));
  console.log(`\n✅ Benchmark finished. CSV written to ${outPath}`);
}

await run();