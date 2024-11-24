import axios from "axios";

export const API_URL = `http://185.46.10.111/api`;
const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.authorization =
    "Bearer $2b$12$IDWkgcBO6qA8xXHovNrejefn9yiDJ4I5OJ4iDcyyNIzFyDeaasnTe";
  return config;
});

export default $api;
