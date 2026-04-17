import api from "./api.js";

const practiceService = {
  getProblems: async (difficulty = "All") => {
    const { data } = await api.get("/practice/problems", {
      params: difficulty === "All" ? {} : { difficulty },
    });
    return data;
  },
  getProblem: async (problemId) => {
    const { data } = await api.get(`/practice/problems/${problemId}`);
    return data;
  },
  runCode: async (problemId, payload) => {
    const { data } = await api.post(`/practice/problems/${problemId}/run`, payload);
    return data;
  },
  submitCode: async (payload) => {
    const { data } = await api.post("/practice/submit", payload);
    return data;
  },
};

export default practiceService;
