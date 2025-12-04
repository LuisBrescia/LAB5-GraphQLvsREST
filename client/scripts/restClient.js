import axios from "axios";

const MARIA = "http://localhost:4000/maria/users";
const MONGO = "http://localhost:4000/mongo/users";

const sample = [
  { name: "Teste 1", age: 22 },
  { name: "Teste 2", age: 25 },
  { name: "Teste 3", age: 30 },
  { name: "Teste 4", age: 18 },
  { name: "Teste 5", age: 27 },
];

// GET REST
export async function fetchMongoRest() {
  const s = performance.now();
  const r = await axios.get(MONGO);
  return {
    label: "REST MongoDB - GET",
    time: performance.now() - s,
    size: JSON.stringify(r.data).length,
  };
}

export async function fetchMariaRest() {
  const s = performance.now();
  const r = await axios.get(MARIA);
  const end = performance.now();
  return {
    label: "REST MariaDB - GET",
    time: end - s,
    size: JSON.stringify(r.data).length,
    lastId: r.data[r.data.length - 1]?.id || 0,
  };
}

// POST MANY
export async function addManyMariaRest() {
  const s = performance.now();
  const create = await axios.post(MARIA, sample);
  return {
    label: "REST MariaDB - POST MANY",
    created: sample,
    baseId: create.data.inserted ? create.data.firstId : 1,
    time: performance.now() - s,
    size: JSON.stringify(sample).length,
  };
}

// PUT MANY
export async function updateManyMariaRest(ids) {
  const modified = sample.map((u, i) => ({
    id: ids[i],
    name: u.name + "++",
    age: u.age + 1,
  }));
  const s = performance.now();
  await axios.put(MARIA, modified);
  return {
    label: "REST MariaDB - PUT MANY",
    time: performance.now() - s,
    size: JSON.stringify(modified).length,
  };
}

// DELETE MANY
export async function deleteManyMariaRest(ids) {
  const s = performance.now();
  await axios.delete(MARIA, { data: { ids } });
  return {
    label: "REST MariaDB - DELETE MANY",
    time: performance.now() - s,
    size: JSON.stringify(ids).length,
  };
}
