import axios from "axios";

const API_BASE = "http://localhost:4000";

export async function fetchUsersRest() {
  const start = performance.now();

  const res = await axios.get(`${API_BASE}/rest/users`);

  const end = performance.now();

  return {
    data: res.data,
    time: end - start,
    size: JSON.stringify(res.data).length,
  };
}
