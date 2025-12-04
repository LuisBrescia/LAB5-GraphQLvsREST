import axios from "axios";

const API = "http://localhost:4000/maria/users";

export async function listUsers() {
  const start = performance.now();
  const res = await axios.get(API);
  const end = performance.now();

  return {
    label: "GET",
    items: res.data.length,
    data: res.data,
    ids: res.data.map((u) => u.id),
    time: end - start,
    size: JSON.stringify(res.data).length,
  };
}

export async function addManyUsers(count = 1000) {
  const sample = Array.from({ length: count }).map((_, i) => ({
    name: `MariaREST-${i}`,
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  await axios.post(API, sample);
  const end = performance.now();

  return {
    label: "POST",
    items: sample.length,
    created: sample,
    time: end - start,
    size: JSON.stringify(sample).length,
  };
}

export async function updateMany(ids) {
  const users = ids.map((id) => ({
    id,
    name: "Atualizado REST",
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  const res = await axios.put(API, { users });
  const end = performance.now();

  return {
    label: "PUT",
    items: users.length,
    size: JSON.stringify(users).length,
    time: end - start,
    updated: res.data.updatedCount,
  };
}

export async function deleteMany(ids) {
  const start = performance.now();
  const res = await axios.delete(API, { data: { ids } });
  const end = performance.now();

  return {
    label: "DELETE",
    items: ids.length,
    size: JSON.stringify(ids).length,
    time: end - start,
    deleted: res.data.deletedCount,
  };
}
