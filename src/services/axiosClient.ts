import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn("Missing VITE_API_BASE_URL in environment variables.");
}

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
