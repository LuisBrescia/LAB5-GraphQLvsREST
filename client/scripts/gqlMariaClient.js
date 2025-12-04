import axios from "axios";

const API = "http://localhost:4000/graphql";

/* ===============================================
   FUNÇÃO BASE
   =============================================== */
async function execGQL(query, variables = {}, extract) {
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

/* ===============================================
   OPERAÇÕES DIRETAS (retornam tempo + size + data)
   =============================================== */
export const fetchMariaGQL = async () =>
  execGQL(`query { mariaUsers { id name age } }`, {}, (d) => d.mariaUsers).then(
    (r) => ({
      ...r,
      label: `GET x${r.data.length}`,
    })
  );

export const postMariaGQL = async (users) =>
  execGQL(
    `mutation($users: [MariaUserInput!]!) {
        mariaAddMany(users: $users) { id name age }
     }`,
    { users },
    (d) => d.mariaAddMany
  ).then((r) => ({ ...r, label: "MariaDB GraphQL POST Many" }));

export const putMariaGQL = async (users) =>
  execGQL(
    `mutation($users:[MariaUserUpdateInput!]!) {
        mariaUpdateMany(users:$users)
    }`,
    { users },
    (d) => d.mariaUpdateMany
  ).then((r) => ({ ...r, label: "MariaDB GraphQL PUT Many" }));

export const deleteMariaGQL = async (ids) =>
  execGQL(
    `mutation($ids:[ID!]!) { mariaDeleteMany(ids:$ids) }`,
    { ids },
    (d) => d.mariaDeleteMany
  ).then((r) => ({ ...r, label: "MariaDB GraphQL DELETE Many" }));

/* ===============================================
   ⏩  TESTES MASSIVOS — x500 / x1000
   =============================================== */

// INSERT xN
export async function addManyMariaGQL(count = 500) {
  const users = Array.from({ length: count }, (_, i) => ({
    name: `MariaGQL-${i}`,
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  const { data } = await postMariaGQL(users);
  const end = performance.now();

  return {
    label: `POST x${count}`,
    time: end - start,
    size: JSON.stringify(data).length,
    ids: data.map((u) => u.id),
  };
}

// UPDATE xN
export async function updateManyMariaGQL(ids) {
  const users = ids.map((id) => ({
    id,
    name: "Updated_GQL",
    age: Math.floor(Math.random() * 50),
  }));

  const { time } = await putMariaGQL(users);
  return { label: `PUT x${ids.length}`, time };
}

// DELETE xN
export async function deleteManyMariaGQL(ids) {
  const { time } = await deleteMariaGQL(ids);
  return { label: `DELETE x${ids.length}`, time };
}
