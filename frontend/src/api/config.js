// Centralized API configuration
// Reads from Vite environment variable or defaults to local Vite proxy/backend
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";
