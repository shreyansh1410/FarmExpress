const PROD_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://farmexpress-dff0.onrender.com";

export const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : PROD_API_BASE_URL;