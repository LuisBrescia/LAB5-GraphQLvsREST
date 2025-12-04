import axios from "axios";

const API = "http://localhost:4000/maria/users";

// ================== LISTAR ==================
export async function listUsers() {
  const start = performance.now();
  const res = await axios.get(API);
  const end = performance.now();

  return {
    label: "REST MariaDB - GET USERS",
    data: res.data,
    ids: res.data.map((u) => u.id),
    time: end - start,
    size: JSON.stringify(res.data).length,
  };
}

// ================== INSERIR EM LOTE ==================
export async function addManyUsers() {
  const sample = [
    { name: "Teste 1", age: 22 },
    { name: "Teste 2", age: 25 },
    { name: "Teste 3", age: 30 },
    { name: "Teste 4", age: 18 },
    { name: "Teste 5", age: 27 },
  ];

  const start = performance.now();
  await axios.post(API, sample);
  const end = performance.now();

  return {
    label: "REST MariaDB - POST MANY",
    created: sample,
    time: end - start,
    size: JSON.stringify(sample).length,
  };
}

// ================== ATUALIZAR EM LOTE ==================
export async function updateMany(ids) {
  const updates = ids.map((id, i) =>
    axios.put(`${API}/${id}`, { name: `Atualizado ${i}`, age: 99 })
  );

  const start = performance.now();
  await Promise.all(updates);
  const end = performance.now();

  return {
    label: "REST MariaDB - PUT MANY",
    updated: ids.length,
    time: end - start,
    size: JSON.stringify(updates).length,
  };
}

// ================== DELETAR EM LOTE ==================
export async function deleteMany(ids) {
  const deletions = ids.map((id) => axios.delete(`${API}/${id}`));

  const start = performance.now();
  await Promise.all(deletions);
  const end = performance.now();

  return {
    label: "REST MariaDB - DELETE MANY",
    deleted: ids.length,
    time: end - start,
    size: JSON.stringify(deletions).length,
  };
}
