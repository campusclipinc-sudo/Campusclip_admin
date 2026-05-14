import axios from "axios";
import { toast } from "react-toastify";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 10000000,
  headers: {
    "content-type": "application/json",
  },
});

client.interceptors.request.use(
  (reqConfig) => {
    return reqConfig;
  },
  (err) => {
    console.error("Request Error", err);
    return Promise.reject(err);
  },
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    const status = err?.response?.status;
    const message = err?.response?.data?.message || "API Error";

    // Only force logout on auth errors
    if (status === 401 || status === 403) {
      const { store } = await import("../store");
      const { logout } = await import("../store/userSlice");
      store.dispatch(logout());
      // Avoid redirect loop if already on login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else {
      // For non-auth errors, just notify and pass the error along
      toast.error(message);
    }

    return Promise.reject(err);
  },
);

export default client;

export const setAuthToken = (token) => {
  client.defaults.headers.common["Authorization"] = "";
  delete client.defaults.headers.common["Authorization"];
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};
