import axios from "axios";

const API = "http://localhost:4000/maria/users";

export async function listUsers() {
  const start = performance.now();
  const res = await axios.get(API);
  const end = performance.now();

  return {
    label: "GET x" + res.data.length,
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
    label: "POST x" + count,
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
  const res = await axios.put(`${API}/many`, { users });
  const end = performance.now();

  return {
    label: "PUT x" + ids.length,
    time: end - start,
    updated: res.data.updatedCount,
  };
}

export async function deleteMany(ids) {
  const start = performance.now();
  const res = await axios.delete(`${API}/many`, { data: { ids } });
  const end = performance.now();

  return {
    label: "DELETE x" + ids.length,
    time: end - start,
    deleted: res.data.deletedCount,
  };
}
