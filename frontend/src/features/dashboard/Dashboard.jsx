import { useEffect, useMemo, useState } from "react";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import { mockProblemSummaries, mockTrendingItems, mockTutorials, normalizeProblemSummary, normalizeProgressOverview, normalizeTutorial } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import practiceService from "../../services/practiceService.js";
import progressService from "../../services/progressService.js";
import tutorialService from "../../services/tutorialService.js";
import { getDemoProgressOverview } from "../../utils/demoState.js";
import { loadAuthState } from "../../utils/storage.js";
import Hero from "./Hero.jsx";
import LearningPaths from "./LearningPaths.jsx";
import Trending from "./Trending.jsx";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [tutorials, setTutorials] = useState(mockTutorials);
  const [problems, setProblems] = useState(mockProblemSummaries);
  const [progress, setProgress] = useState(getDemoProgressOverview());

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const notices = [];
      const demoProgress = getDemoProgressOverview();

      const { token } = loadAuthState();

      const [tutorialResult, problemResult, progressResult] = token 
        ? await Promise.allSettled([
            tutorialService.getTutorials(),
            practiceService.getProblems("All"),
            progressService.getOverview(),
          ])
        : [
            { status: "rejected", reason: new Error("Unauthenticated") },
            { status: "rejected", reason: new Error("Unauthenticated") },
            { status: "rejected", reason: new Error("Unauthenticated") },
          ];

      if (!isMounted) {
        return;
      }

      const tutorialItems =
        tutorialResult.status === "fulfilled" && tutorialResult.value.length
          ? tutorialResult.value.map((tutorial, index) => normalizeTutorial(tutorial, index))
          : (() => {
              notices.push("Tutorials are using seeded content.");
              return mockTutorials;
            })();

      const problemItems =
        problemResult.status === "fulfilled" && problemResult.value.length
          ? problemResult.value.map((problem, index) => normalizeProblemSummary(problem, index))
          : (() => {
              notices.push("Practice problems are using seeded content.");
              return mockProblemSummaries;
            })();

      const mergedProgress =
        progressResult.status === "fulfilled"
          ? {
              ...demoProgress,
              ...normalizeProgressOverview(progressResult.value),
              pathProgress: demoProgress.pathProgress,
              activity: demoProgress.activity,
              toolsUsed: demoProgress.toolsUsed,
            }
          : (() => {
              notices.push(
                progressResult.status === "rejected"
                  ? getApiErrorMessage(progressResult.reason)
                  : "Progress is using local demo history.",
              );
              return demoProgress;
            })();

      setTutorials(tutorialItems);
      setProblems(problemItems);
      setProgress(mergedProgress);
      setNotice(notices.join(" "));
      setLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTrending = useMemo(() => {
    if (!query.trim()) {
      return mockTrendingItems;
    }

    const normalized = query.toLowerCase();
    return mockTrendingItems.filter((item) =>
      [item.title, item.description, ...(item.tags || [])].join(" ").toLowerCase().includes(normalized),
    );
  }, [query]);

  if (loading) {
    return <LoadingState label="Building your learning workspace..." />;
  }

  return (
    <div className="space-y-8">
      <Hero
        onQueryChange={setQuery}
        query={query}
        stats={{
          tutorialCount: tutorials.length,
          problemCount: problems.length,
          acceptanceRate: progress.stats.acceptanceRate,
          activeStreak: progress.stats.activeStreak,
        }}
      />

      {notice ? (
        <NoticeBanner title="Fallback data is active" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      <Trending items={filteredTrending.length ? filteredTrending : mockTrendingItems} />
      <LearningPaths paths={progress.pathProgress} />
    </div>
  );
};

export default Dashboard;
