import api from "./api.js";

const tutorialService = {
  getTutorials: async () => {
    const { data } = await api.get("/tutorials");
    return data;
  },
  getTutorial: async (tutorialId) => {
    const { data } = await api.get(`/tutorials/${tutorialId}`);
    return data;
  },
  markComplete: async (tutorialId) => {
    const { data } = await api.post(`/progress/tutorials/${tutorialId}/complete`);
    return data;
  },
};

export default tutorialService;
