import axios from "axios";

/**
 * Cria um client REST genérico para qualquer banco
 *
 * @param {string} prefix - "maria" | "mongo"
 * @param {string} idField - campo do ID retornado no GET ("id" ou "_id")
 */
export function createRestClient(prefix, idField = "id") {
  const API = `http://localhost:4000/${prefix}/users`;

  // GET
  async function list() {
    const start = performance.now();
    const res = await axios.get(API);
    const end = performance.now();

    const data = res.data;

    return {
      label: "GET",
      data,
      ids: data.map((u) => u[idField]),
      time: end - start,
      size: JSON.stringify(data).length,
      items: data.length,
    };
  }

  // POST
  async function addMany(count = 1000) {
    const sample = Array.from({ length: count }).map((_, i) => ({
      name: `${capitalize(prefix)}REST-${i}`,
      age: Math.floor(Math.random() * 50) + 18,
    }));

    const start = performance.now();
    await axios.post(API, sample);
    const end = performance.now();

    return {
      label: "POST",
      items: sample.length,
      created: sample.length,
      time: end - start,
      size: JSON.stringify(sample).length,
    };
  }

  // PUT
  async function updateMany(ids) {
    const users = ids.map((id, i) => ({
      id,
      name: `${capitalize(prefix)}Updated-${i}`,
      age: Math.floor(Math.random() * 50),
    }));

    const start = performance.now();
    const res = await axios.put(API, prefix === "maria" ? { users } : users);
    const end = performance.now();

    return {
      label: "PUT",
      items: ids.length,
      updated: prefix === "maria" ? res.data.updatedCount : ids.length,
      time: end - start,
      size: JSON.stringify(users).length,
    };
  }

  // DELETE
  async function deleteMany(ids) {
    const start = performance.now();
    const res = await axios.delete(API, { data: { ids } });
    const end = performance.now();

    return {
      label: "DELETE",
      items: ids.length,
      deleted: res.data?.deletedCount ?? ids.length,
      time: end - start,
      size: JSON.stringify(ids).length,
    };
  }

  return {
    list,
    addMany,
    updateMany,
    deleteMany,
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
