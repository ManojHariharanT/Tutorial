import api from "./api.js";

const progressService = {
  getOverview: async () => {
    const { data } = await api.get("/progress/overview");
    return data;
  },
};

export default progressService;
