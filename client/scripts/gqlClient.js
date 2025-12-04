import axios from "axios";

const API = "http://localhost:4000/graphql";

async function gql(query) {
  const start = performance.now();
  const res = await axios.post(API, { query });
  const end = performance.now();

  const data = Object.values(res.data.data)[0];

  return {
    time: end - start,
    size: JSON.stringify(data).length,
    data,
  };
}

// MongoDB GraphQL
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

// MariaDB GraphQL
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
