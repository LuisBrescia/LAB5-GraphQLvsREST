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

/* ================= GET ================= */
export const fetchMongoGQL = () =>
  execGQL(`query { mongoUsers { id name age } }`, {}, (d) => d.mongoUsers).then(
    (r) => ({
      ...r,
      label: `GET x${r.data.length}`,
    })
  );

/* ================= INSERT MANY ================= */
export const postMongoGQL = (users) =>
  execGQL(
    `mutation($users: [MongoUserInput!]!) {
        mongoAddMany(users: $users) { id name age }
    }`,
    { users },
    (d) => d.mongoAddMany
  ).then((r) => ({ ...r, label: "MongoDB GraphQL POST Many" }));

/* ================= UPDATE MANY ================= */
export const putMongoGQL = (users) =>
  execGQL(
    `mutation($users:[MongoUserUpdateInput!]!) {
        mongoUpdateMany(users:$users)
    }`,
    { users },
    (d) => d.mongoUpdateMany
  ).then((r) => ({ ...r, label: "MongoDB GraphQL PUT Many" }));

/* ================= DELETE MANY ================= */
export const deleteMongoGQL = (ids) =>
  execGQL(
    `mutation($ids:[ID!]!) { mongoDeleteMany(ids:$ids) }`,
    { ids },
    (d) => d.mongoDeleteMany
  ).then((r) => ({ ...r, label: "MongoDB GraphQL DELETE Many" }));

/* =============== TESTES MASSIVOS =============== */
export async function addManyMongoGQL(count = 500) {
  const users = Array.from({ length: count }, (_, i) => ({
    name: `MongoGQL-${i}`,
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  const { data } = await postMongoGQL(users);
  const end = performance.now();

  return {
    label: `POST x${count}`,
    time: end - start,
    size: JSON.stringify(data).length,
    ids: data.map((u) => u.id),
  };
}

export async function updateManyMongoGQL(ids) {
  const users = ids.map((id) => ({
    id,
    name: "Updated_GQL",
    age: Math.floor(Math.random() * 50),
  }));

  const { time } = await putMongoGQL(users);
  return { label: `PUT x${ids.length}`, time };
}

export async function deleteManyMongoGQL(ids) {
  const { time } = await deleteMongoGQL(ids);
  return { label: `DELETE x${ids.length}`, time };
}
