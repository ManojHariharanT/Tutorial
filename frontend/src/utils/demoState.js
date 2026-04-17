import {
  mockLearningPaths,
  mockProblems,
  mockProgressOverview,
  mockTutorials,
} from "../config/mockContent.js";

const DEMO_STATE_KEY = "learning-platform-demo-state";

const buildSeededActivity = () => ({
  "2026-04-04": 1,
  "2026-04-07": 2,
  "2026-04-09": 1,
  "2026-04-11": 3,
  "2026-04-13": 2,
  "2026-04-15": 4,
  "2026-04-16": 2,
});

const createDefaultState = () => ({
  completedTutorialIds: mockProgressOverview.completedTutorials.map((tutorial) => tutorial._id),
  solvedProblemIds: mockProgressOverview.solvedProblems.map((problem) => problem._id),
  submissions: mockProgressOverview.recentSubmissions.map((submission) => ({
    id: submission._id,
    problemId: mockProblems.find((problem) => problem.title === submission.problemId.title)?._id,
    status: submission.status,
    passed: submission.passed,
    total: submission.total,
    createdAt: submission.createdAt,
  })),
  activity: buildSeededActivity(),
  playgroundRuns: 5,
  toolsUsed: {
    "json-formatter": 6,
    "json-validator": 3,
  },
});

const safeWindow = () => (typeof window !== "undefined" ? window : null);

const clone = (value) => JSON.parse(JSON.stringify(value));

export const loadDemoState = () => {
  const currentWindow = safeWindow();

  if (!currentWindow) {
    return createDefaultState();
  }

  try {
    const raw = currentWindow.localStorage.getItem(DEMO_STATE_KEY);
    return raw ? { ...createDefaultState(), ...JSON.parse(raw) } : createDefaultState();
  } catch (_error) {
    return createDefaultState();
  }
};

export const saveDemoState = (state) => {
  const currentWindow = safeWindow();

  if (!currentWindow) {
    return;
  }

  currentWindow.localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
};

const updateDemoState = (updater) => {
  const current = clone(loadDemoState());
  const next = updater(current);
  saveDemoState(next);
  return next;
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const recordActivity = (state, amount = 1) => {
  const key = todayKey();
  state.activity[key] = (state.activity[key] || 0) + amount;
};

export const markDemoTutorialComplete = (tutorialId) =>
  updateDemoState((state) => {
    if (!state.completedTutorialIds.includes(tutorialId)) {
      state.completedTutorialIds.push(tutorialId);
      recordActivity(state, 2);
    }

    return state;
  });

export const recordDemoSubmission = ({ problemId, status, passed, total }) =>
  updateDemoState((state) => {
    const submission = {
      id: `demo-submission-${Date.now()}`,
      problemId,
      status,
      passed,
      total,
      createdAt: new Date().toISOString(),
    };

    state.submissions.unshift(submission);
    state.submissions = state.submissions.slice(0, 20);
    recordActivity(state, 2);

    if (status === "Accepted" && !state.solvedProblemIds.includes(problemId)) {
      state.solvedProblemIds.push(problemId);
    }

    return state;
  });

export const recordDemoPlaygroundRun = () =>
  updateDemoState((state) => {
    state.playgroundRuns += 1;
    recordActivity(state);
    return state;
  });

export const recordDemoToolUsage = (toolId) =>
  updateDemoState((state) => {
    state.toolsUsed[toolId] = (state.toolsUsed[toolId] || 0) + 1;
    recordActivity(state);
    return state;
  });

const buildHeatmap = (activityMap, totalDays = 84) =>
  Array.from({ length: totalDays }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (totalDays - index - 1));
    const dateKey = date.toISOString().slice(0, 10);
    const count = activityMap[dateKey] || 0;

    return {
      date: dateKey,
      count,
      level: count >= 4 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0,
    };
  });

const buildPathProgress = (state) =>
  mockLearningPaths.map((path) => {
    const completedTutorials = path.tutorialIds.filter((id) =>
      state.completedTutorialIds.includes(id),
    ).length;
    const solvedProblems = path.problemIds.filter((id) =>
      state.solvedProblemIds.includes(id),
    ).length;
    const totalItems = path.tutorialIds.length + path.problemIds.length;
    const completedItems = completedTutorials + solvedProblems;

    return {
      ...path,
      completedTutorials,
      solvedProblems,
      totalItems,
      completedItems,
      progress: totalItems ? Math.round((completedItems / totalItems) * 100) : 0,
    };
  });

export const getDemoProgressOverview = () => {
  const state = loadDemoState();
  const completedTutorials = mockTutorials.filter((tutorial) =>
    state.completedTutorialIds.includes(tutorial._id),
  );
  const solvedProblems = mockProblems.filter((problem) =>
    state.solvedProblemIds.includes(problem._id),
  );
  const acceptedCount = state.submissions.filter((submission) => submission.status === "Accepted").length;
  const totalSubmissions = state.submissions.length;
  const activity = buildHeatmap(state.activity);
  const pathProgress = buildPathProgress(state);

  return {
    stats: {
      completedTutorialCount: completedTutorials.length,
      solvedProblemCount: solvedProblems.length,
      totalSubmissions,
      acceptanceRate: totalSubmissions ? Math.round((acceptedCount / totalSubmissions) * 100) : 0,
      playgroundRuns: state.playgroundRuns,
      activeStreak: activity.reduce((streak, day) => (day.count ? streak + 1 : streak), 0),
    },
    completedTutorials,
    solvedProblems,
    recentSubmissions: state.submissions.slice(0, 5).map((submission) => {
      const problem = mockProblems.find((entry) => entry._id === submission.problemId) || mockProblems[0];

      return {
        _id: submission.id,
        problemId: {
          title: problem.title,
          difficulty: problem.difficulty,
        },
        passed: submission.passed,
        total: submission.total,
        status: submission.status,
        createdAt: submission.createdAt,
      };
    }),
    activity,
    pathProgress,
    toolsUsed: state.toolsUsed,
  };
};
