import api from "./api.js";

const playgroundService = {
  runCode: async (payload) => {
    const { data } = await api.post("/playground/run", payload);
    return data;
  },
};

export default playgroundService;
