import axios from "axios";

const API = "http://localhost:4000/mongo/users";

// ======================= GET MANY =======================
export async function listMongoUsers() {
  const start = performance.now();
  const res = await axios.get(API);
  const end = performance.now();

  return {
    label: "REST MongoDB GET x" + res.data.length,
    data: res.data,
    ids: res.data.map((u) => u._id),
    time: end - start,
    size: JSON.stringify(res.data).length,
  };
}

// ======================= INSERT MANY =======================
export async function addManyMongo(count = 1000) {
  const sample = Array.from({ length: count }, (_, i) => ({
    name: `MongoREST-${i}`,
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  await axios.post(API, sample);
  const end = performance.now();

  return {
    label: "REST MongoDB INSERT x" + count,
    created: count,
    time: end - start,
    size: JSON.stringify(sample).length,
  };
}

// ======================= UPDATE MANY =======================
export async function updateManyMongo(ids) {
  const users = ids.map((id, i) => ({
    id,
    name: `MongoUpdated-${i}`,
    age: 99,
  }));

  const start = performance.now();
  await axios.put(API, users);
  const end = performance.now();

  return {
    label: "REST MongoDB UPDATE x" + ids.length,
    updated: ids.length,
    time: end - start,
    size: JSON.stringify(users).length,
  };
}

// ======================= DELETE MANY =======================
export async function deleteManyMongo(ids) {
  const start = performance.now();
  await axios.delete(API, { data: { ids } }); // <-- corrigido!
  const end = performance.now();

  return {
    label: "REST MongoDB DELETE x" + ids.length,
    deleted: ids.length,
    time: end - start,
    size: JSON.stringify(ids).length,
  };
}
