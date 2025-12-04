import axios from "axios";

const API = "http://localhost:4000";

export async function fetchMongoRest() {
  const start = performance.now();
  const res = await axios.get(`${API}/mongo/users`);
  const end = performance.now();

  return {
    label: "MongoDB REST",
    time: end - start,
    size: JSON.stringify(res.data).length,
    data: res.data,
  };
}

export async function fetchMariaRest() {
  const start = performance.now();
  const res = await axios.get(`${API}/maria/users`);
  const end = performance.now();

  return {
    label: "MariaDB REST",
    time: end - start,
    size: JSON.stringify(res.data).length,
    data: res.data,
  };
}
