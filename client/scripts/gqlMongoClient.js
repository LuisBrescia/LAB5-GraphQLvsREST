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

export const fetchMongoGQL = () =>
  execGQL(`query { mongoUsers { id name age } }`, {}, (d) => d.mongoUsers).then(
    (r) => ({
      ...r,
      label: `GET`,
      items: r.data.length,
      size: JSON.stringify(r.data).length,
    })
  );

export const postMongoGQL = (users) =>
  execGQL(
    `mutation($users: [MongoUserInput!]!) {
        mongoAddMany(users: $users) { id name age }
    }`,
    { users },
    (d) => d.mongoAddMany
  ).then((r) => ({ ...r, label: "MongoDB GraphQL POST Many" }));

export const putMongoGQL = (users) =>
  execGQL(
    `mutation($users:[MongoUserUpdateInput!]!) {
        mongoUpdateMany(users:$users)
    }`,
    { users },
    (d) => d.mongoUpdateMany
  ).then((r) => ({ ...r, label: "MongoDB GraphQL PUT Many" }));

export const deleteMongoGQL = (ids) =>
  execGQL(
    `mutation($ids:[ID!]!) { mongoDeleteMany(ids:$ids) }`,
    { ids },
    (d) => d.mongoDeleteMany
  ).then((r) => ({ ...r, label: "MongoDB GraphQL DELETE Many" }));

export async function addManyMongoGQL(count = 500) {
  const users = Array.from({ length: count }, (_, i) => ({
    name: `MongoGQL-${i}`,
    age: Math.floor(Math.random() * 50) + 18,
  }));

  const start = performance.now();
  const { data } = await postMongoGQL(users);
  const end = performance.now();

  return {
    label: `POST`,
    items: users.length,
    time: end - start,
    size: JSON.stringify(users).length,
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
  return {
    label: `PUT`,
    items: users.length,
    size: JSON.stringify(users).length,
    time,
  };
}

export async function deleteManyMongoGQL(ids) {
  const { time } = await deleteMongoGQL(ids);
  return {
    label: `DELETE`,
    items: ids.length,
    size: JSON.stringify(ids).length,
    time,
  };
}
