import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    return config;
  }

  let userId = localStorage.getItem("user_id");

  if (!userId) {
    userId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}user/create/`,
      {
        uuid: userId,
      }
    );

    localStorage.setItem("user_id", userId);
  }

  config.headers["X-User-ID"] = userId;

  return config;
});

export default api;