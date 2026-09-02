import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const api = axios.create({
  baseURL: configuredBaseUrl || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default function Request(payload, wait = 350) {
  return new Promise(resolve =>
    window.setTimeout(() => resolve(payload), wait)
  );
}
