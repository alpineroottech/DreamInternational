import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach JWT (Bearer) from localStorage on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("di_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear the stored session so route guards redirect to login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("di_token");
    }
    return Promise.reject(error);
  }
);

export default api;
