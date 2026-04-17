import { useEffect, useMemo, useState } from "react";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import { mockProgressOverview, mockTutorials } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import progressService from "../../services/progressService.js";
import tutorialService from "../../services/tutorialService.js";

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [activeExamples, setActiveExamples] = useState({});
  const [completingId, setCompletingId] = useState("");
  const [demoCompletedIds, setDemoCompletedIds] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTutorials = async () => {
      const notices = [];

      try {
        const [tutorialResult, overviewResult] = await Promise.allSettled([
          tutorialService.getTutorials(),
          progressService.getOverview(),
        ]);

        if (!isMounted) {
          return;
        }

        const tutorialResponse =
          tutorialResult.status === "fulfilled" && tutorialResult.value.length
            ? tutorialResult.value
            : (() => {
                notices.push("Tutorial content is using demo lessons right now.");
                return mockTutorials;
              })();

        const overviewResponse =
          overviewResult.status === "fulfilled"
            ? overviewResult.value
            : (() => {
                notices.push("Progress syncing is unavailable. Completion updates will stay local on this page.");
                return mockProgressOverview;
              })();

        setTutorials(tutorialResponse);
        setOverview(overviewResponse);
        setIsDemoMode(
          tutorialResult.status !== "fulfilled" ||
            !tutorialResult.value.length ||
            overviewResult.status !== "fulfilled",
        );
        setNotice(notices.join(" "));
        setActiveExamples(
          tutorialResponse.reduce(
            (accumulator, tutorial) => ({
              ...accumulator,
              [tutorial._id]: tutorial.languageExamples[0]?.language || "JavaScript",
            }),
            {},
          ),
        );
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setTutorials(mockTutorials);
        setOverview(mockProgressOverview);
        setIsDemoMode(true);
        setNotice(getApiErrorMessage(loadError));
        setActiveExamples(
          mockTutorials.reduce(
            (accumulator, tutorial) => ({
              ...accumulator,
              [tutorial._id]: tutorial.languageExamples[0]?.language || "JavaScript",
            }),
            {},
          ),
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTutorials();

    return () => {
      isMounted = false;
    };
  }, []);

  const completedTutorialIds = useMemo(
    () =>
      new Set([
        ...(overview?.completedTutorials || []).map((tutorial) => tutorial._id),
        ...demoCompletedIds,
      ]),
    [demoCompletedIds, overview],
  );

  const handleCompleteTutorial = async (tutorialId) => {
    setCompletingId(tutorialId);

    try {
      if (isDemoMode) {
        setDemoCompletedIds((current) =>
          current.includes(tutorialId) ? current : [...current, tutorialId],
        );
        return;
      }

      const nextOverview = await tutorialService.markComplete(tutorialId);
      setOverview(nextOverview);
    } catch (completeError) {
      setDemoCompletedIds((current) =>
        current.includes(tutorialId) ? current : [...current, tutorialId],
      );
      setNotice(getApiErrorMessage(completeError));
    } finally {
      setCompletingId("");
    }
  };

  if (loading) {
    return <LoadingState label="Loading tutorials..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tutorials"
        title="Structured lessons with multi-language examples."
        description="These seeded tutorials give the platform content immediately while keeping the backend ready for real MongoDB data."
      />

      {notice ? (
        <NoticeBanner tone={isDemoMode ? "warning" : "error"} title={isDemoMode ? "Demo content active" : "Could not fully sync tutorials"}>
          {notice}
        </NoticeBanner>
      ) : null}

      <div className="grid gap-6">
        {tutorials.map((tutorial) => {
          const activeLanguage = activeExamples[tutorial._id];
          const selectedExample =
            tutorial.languageExamples.find((example) => example.language === activeLanguage) ||
            tutorial.languageExamples[0];
          const isCompleted = completedTutorialIds.has(tutorial._id);

          return (
            <SectionCard key={tutorial._id} className="overflow-hidden">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="inline-flex rounded-full bg-peach-50 px-3 py-1 text-xs font-semibold text-orange-700">
                    Tutorial
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-900">{tutorial.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">{tutorial.description}</p>
                </div>

                <button
                  className={isCompleted ? "soft-button-secondary" : "soft-button-primary"}
                  disabled={isCompleted || completingId === tutorial._id}
                  onClick={() => handleCompleteTutorial(tutorial._id)}
                  type="button"
                >
                  {isCompleted
                    ? "Completed"
                    : completingId === tutorial._id
                      ? "Saving..."
                      : "Mark Complete"}
                </button>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Lesson Summary
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{tutorial.content}</p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-5 text-white">
                  <div className="flex flex-wrap gap-2">
                    {tutorial.languageExamples.map((example) => (
                      <button
                        key={example.language}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          activeLanguage === example.language
                            ? "bg-white text-slate-900"
                            : "bg-white/10 text-slate-200 hover:bg-white/20"
                        }`}
                        onClick={() =>
                          setActiveExamples((current) => ({
                            ...current,
                            [tutorial._id]: example.language,
                          }))
                        }
                        type="button"
                      >
                        {example.language}
                      </button>
                    ))}
                  </div>

                  <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950/80 p-4 font-mono text-sm leading-6 text-slate-100">
                    <code>{selectedExample?.code}</code>
                  </pre>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
};

export default TutorialsPage;
