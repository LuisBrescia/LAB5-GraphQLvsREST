import axios from "axios";

const API = "http://localhost:4000/graphql";

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

export const fetchMariaGQL = async () =>
  execGQL(`query { mariaUsers { id name age } }`, {}, (d) => d.mariaUsers).then(
    (r) => ({
      ...r,
      label: `GET`,
      items: r.data.length,
      size: JSON.stringify(r.data).length,
    })
  );

export const postMariaGQL = async (users) =>
  execGQL(
    `mutation($users: [MariaUserInput!]!) {
        mariaAddMany(users: $users) { id name age }
     }`,
    { users },
    (d) => d.mariaAddMany
  ).then((r) => ({ ...r }));

export const putMariaGQL = async (users) =>
  execGQL(
    `mutation($users:[MariaUserUpdateInput!]!) {
        mariaUpdateMany(users:$users)
    }`,
    { users },
    (d) => d.mariaUpdateMany
  ).then((r) => ({ ...r }));

export const deleteMariaGQL = async (ids) =>
  execGQL(
    `mutation($ids:[ID!]!) { mariaDeleteMany(ids:$ids) }`,
    { ids },
    (d) => d.mariaDeleteMany
  ).then((r) => ({ ...r }));

export async function addManyMariaGQL(count = 500) {
  const users = Array.from({ length: count }, (_, i) => ({
    name: `MariaGQL-${i}`,
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  const { data } = await postMariaGQL(users);
  const end = performance.now();

  return {
    label: `POST`,
    items: users.length,
    time: end - start,
    size: JSON.stringify(data).length,
    ids: data.map((u) => u.id),
  };
}

export async function updateManyMariaGQL(ids) {
  const users = ids.map((id) => ({
    id,
    name: "Updated_GQL",
    age: Math.floor(Math.random() * 50),
  }));

  const { time } = await putMariaGQL(users);
  return {
    label: `PUT`,
    items: users.length,
    size: JSON.stringify(users).length,
    time,
  };
}

export async function deleteManyMariaGQL(ids) {
  const { time } = await deleteMariaGQL(ids);
  return {
    label: `DELETE`,
    items: ids.length,
    size: JSON.stringify(ids).length,
    time,
  };
}
