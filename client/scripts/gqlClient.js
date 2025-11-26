import axios from "axios";

const API_BASE = "http://localhost:4000/graphql";

export async function fetchUsersGraphQL() {
  const query = {
    query: `
      query {
        users {
          id
          name
          age
        }
      }
    `,
  };

  const start = performance.now();

  const res = await axios.post(API_BASE, query);

  const end = performance.now();

  const data = res.data.data.users;

  return {
    data,
    time: end - start,
    size: JSON.stringify(data).length,
  };
}
