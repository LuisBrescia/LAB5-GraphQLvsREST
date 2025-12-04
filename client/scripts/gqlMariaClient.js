import axios from "axios";

const API = "http://localhost:4000/graphql";

// Função genérica para chamadas GraphQL
async function gql(query, variables = {}) {
  const start = performance.now();
  const res = await axios.post(API, { query, variables });
  const end = performance.now();

  const data = Object.values(res.data.data)[0];

  return {
    time: end - start,
    size: JSON.stringify(data).length,
    data,
  };
}

/* ======================= READ ======================= */

// MariaDB GraphQL GET All
export async function fetchMariaGQL() {
  const q = `
    query {
      mariaUsers {
        id
        name
        age
      }
    }
  `;
  const { time, size, data } = await gql(q);
  return { label: "MariaDB GraphQL", time, size, data };
}

/* ======================= CREATE ======================= */

export async function postMariaGQL(users) {
  const q = `
    mutation($users: [MariaUserInput!]!) {
      mariaAddMany(users: $users) {
        id
        name
        age
      }
    }
  `;

  const start = performance.now();
  const res = await axios.post(API, {
    query: q,
    variables: { users },
  });
  const end = performance.now();

  const data = res.data.data.mariaAddMany;

  return {
    label: "MariaDB GraphQL POST Many",
    time: end - start,
    size: JSON.stringify(data).length,
    data,
  };
}

/* ======================= UPDATE ======================= */

export async function putMariaGQL(users) {
  const q = `
    mutation($users: [MariaUserUpdateInput!]!) {
      mariaUpdateMany(users: $users)
    }
  `;

  const start = performance.now();
  const res = await axios.post(API, {
    query: q,
    variables: { users },
  });
  const end = performance.now();

  return {
    label: "MariaDB GraphQL PUT Many",
    time: end - start,
    updated: res.data.data.mariaUpdateMany,
  };
}

/* ======================= DELETE ======================= */

export async function deleteMariaGQL(ids) {
  const q = `
    mutation($ids: [ID!]!) {
      mariaDeleteMany(ids: $ids)
    }
  `;

  const start = performance.now();
  const res = await axios.post(API, {
    query: q,
    variables: { ids },
  });
  const end = performance.now();

  return {
    label: "MariaDB GraphQL DELETE Many",
    time: end - start,
    deleted: res.data.data.mariaDeleteMany,
  };
}
