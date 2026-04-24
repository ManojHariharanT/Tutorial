import api from "./api.js";

const playgroundService = {
  listLanguages: async () => {
    const { data } = await api.get("/playground/languages");
    return data.languages || [];
  },
  runCode: async (payload) => {
    const { data } = await api.post("/playground/run", payload);
    return data;
  },
};

export default playgroundService;
