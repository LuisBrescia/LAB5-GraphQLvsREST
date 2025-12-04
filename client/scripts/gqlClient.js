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

// MongoDB GraphQL GET All
export async function fetchMongoGQL() {
  const q = `
    query {
      mongoUsers {
        id
        name
        age
      }
    }
  `;
  const { time, size, data } = await gql(q);
  return { label: "MongoDB GraphQL", time, size, data };
}

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

export async function postMariaGQL(user) {
  const q = `
    mutation($name: String!, $age: Int!) {
      createMariaUser(name: $name, age: $age) {
        id
        name
        age
      }
    }
  `;

  const { time, size, data } = await gql(q, user);
  return { label: "MariaDB GraphQL POST", time, size, data };
}

/* ======================= UPDATE ======================= */

export async function putMariaGQL(user) {
  const q = `
    mutation($id: ID!, $name: String, $age: Int) {
      updateMariaUser(id: $id, name: $name, age: $age) {
        id
        name
        age
      }
    }
  `;

  const { time, size, data } = await gql(q, user);
  return { label: "MariaDB GraphQL PUT", time, size, data };
}

/* ======================= DELETE ======================= */

export async function deleteMariaGQL(id) {
  const q = `
    mutation($id: ID!) {
      deleteMariaUser(id: $id)
    }
  `;

  const { time, size, data } = await gql(q, { id });
  return { label: "MariaDB GraphQL DELETE", time, size, data };
}
