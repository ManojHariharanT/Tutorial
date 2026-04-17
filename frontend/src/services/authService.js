import api from "./api.js";

const authService = {
  login: async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  getProfile: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

export default authService;
