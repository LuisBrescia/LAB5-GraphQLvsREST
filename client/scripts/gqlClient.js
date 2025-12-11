import axios from "axios";

const API = "http://localhost:4000/graphql";

async function execGQL(query, extract, variables = {}) {
  const start = performance.now();
  const res = await axios.post(API, { query, variables });
  const end = performance.now();

  const data = extract(res.data.data);

  return {
    time: end - start,
    size: JSON.stringify(data).length,
    data,
  };
}

/**
 * Factory para criar um client GraphQL para qualquer banco
 *
 * @param {string} prefix - ex: "maria" | "mongo"
 * @returns objeto com métodos CRUD
 */
export function createGQLClient(prefix) {
  const Users = `${prefix}Users`;
  const AddMany = `${prefix}AddMany`;
  const UpdateMany = `${prefix}UpdateMany`;
  const DeleteMany = `${prefix}DeleteMany`;

  const UserInput = `${capitalize(prefix)}UserInput`;
  const UserUpdateInput = `${capitalize(prefix)}UserUpdateInput`;

  // GET
  async function fetchMany() {
    return execGQL(`query { ${Users} { id name age } }`, (d) => d[Users]).then(
      (r) => ({
        ...r,
        label: "GET",
        items: r.data.length,
        size: JSON.stringify(r.data).length,
      })
    );
  }

  // POST
  async function addMany(count = 500) {
    const users = Array.from({ length: count }, (_, i) => ({
      name: `${capitalize(prefix)}GQL-${i}`,
      age: Math.floor(Math.random() * 50) + 18,
    }));

    const start = performance.now();
    const { data } = await execGQL(
      `mutation($users: [${UserInput}!]!) {
        ${AddMany}(users: $users) { id name age }
      }`,
      (d) => d[AddMany],
      { users }
    );
    const end = performance.now();

    return {
      label: "POST",
      items: data.length,
      time: end - start,
      size: JSON.stringify(data).length,
      ids: data.map((u) => u.id),
    };
  }

  // PUT
  async function updateMany(ids) {
    const users = ids.map((id) => ({
      id,
      name: "Updated_GQL",
      age: Math.floor(Math.random() * 50),
    }));

    const { time } = await execGQL(
      `mutation($users:[${UserUpdateInput}!]!) {
        ${UpdateMany}(users: $users)
      }`,
      (d) => d[UpdateMany],
      { users }
    );

    return {
      label: "PUT",
      items: users.length,
      size: JSON.stringify(users).length,
      time,
    };
  }

  // DELETE
  async function deleteMany(ids) {
    const { time } = await execGQL(
      `mutation($ids:[ID!]!) {
        ${DeleteMany}(ids: $ids)
      }`,
      (d) => d[DeleteMany],
      { ids }
    );

    return {
      label: "DELETE",
      items: ids.length,
      size: JSON.stringify(ids).length,
      time,
    };
  }

  return {
    fetchMany,
    addMany,
    updateMany,
    deleteMany,
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
