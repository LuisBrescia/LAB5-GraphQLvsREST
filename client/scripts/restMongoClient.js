import axios from "axios";

const API = "http://localhost:4000/mongo/users";

export async function listMongoUsers() {
  const start = performance.now();
  const res = await axios.get(API);
  const end = performance.now();

  return {
    label: "GET",
    data: res.data,
    ids: res.data.map((u) => u._id),
    time: end - start,
    size: JSON.stringify(res.data).length,
    items: res.data.length,
  };
}

export async function addManyMongo(count = 1000) {
  const sample = Array.from({ length: count }, (_, i) => ({
    name: `MongoREST-${i}`,
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  await axios.post(API, sample);
  const end = performance.now();

  return {
    label: "POST",
    items: sample.length,
    created: count,
    time: end - start,
    size: JSON.stringify(sample).length,
  };
}

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
    label: "PUT",
    items: users.length,
    updated: ids.length,
    time: end - start,
    size: JSON.stringify(users).length,
  };
}

export async function deleteManyMongo(ids) {
  const start = performance.now();
  await axios.delete(API, { data: { ids } });
  const end = performance.now();

  return {
    label: "DELETE",
    items: ids.length,
    deleted: ids.length,
    time: end - start,
    size: JSON.stringify(ids).length,
  };
}
