import { useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import StatCard from "../../components/StatCard.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import { mockProgressOverview } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import progressService from "../../services/progressService.js";

const ProgressPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      try {
        const response = await progressService.getOverview();

        if (!isMounted) {
          return;
        }

        setOverview(response);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setOverview(mockProgressOverview);
        setIsDemoMode(true);
        setNotice(getApiErrorMessage(loadError));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingState label="Loading progress..." />;
  }

  const stats = overview?.stats || {
    completedTutorialCount: 0,
    solvedProblemCount: 0,
    totalSubmissions: 0,
    acceptanceRate: 0,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Progress"
        title="Track what you have completed and solved."
        description="This page combines tutorial progress, accepted practice work, and your most recent submission activity."
      />

      {notice ? (
        <NoticeBanner tone={isDemoMode ? "warning" : "error"} title="Progress is in fallback mode">
          {notice}
        </NoticeBanner>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper="Completed lessons"
          label="Tutorials Done"
          tone="peach"
          value={stats.completedTutorialCount}
        />
        <StatCard
          helper="Problems solved successfully"
          label="Problems Solved"
          tone="mint"
          value={stats.solvedProblemCount}
        />
        <StatCard
          helper="All submissions stored in MongoDB"
          label="Submissions"
          tone="brand"
          value={stats.totalSubmissions}
        />
        <StatCard
          helper="Overall accepted submission rate"
          label="Acceptance"
          value={`${stats.acceptanceRate}%`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Completed Tutorials">
          {overview?.completedTutorials?.length ? (
            <div className="space-y-3">
              {overview.completedTutorials.map((tutorial) => (
                <div key={tutorial._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{tutorial.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{tutorial.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No tutorials completed yet. Mark lessons complete as you work through them.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Solved Problems">
          {overview?.solvedProblems?.length ? (
            <div className="space-y-3">
              {overview.solvedProblems.map((problem) => (
                <div
                  key={problem._id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{problem.title}</p>
                  <StatusPill>{problem.difficulty}</StatusPill>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No accepted problems yet. Submit solutions from the practice module to populate this list.
            </p>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Recent Submissions">
        {overview?.recentSubmissions?.length ? (
          <div className="space-y-3">
            {overview.recentSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{submission.problemId?.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {submission.passed}/{submission.total} tests passed
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill>{submission.problemId?.difficulty || "Easy"}</StatusPill>
                  <StatusPill>{submission.status}</StatusPill>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Your submission history will appear here after you start sending solutions.
          </p>
        )}
      </SectionCard>
    </div>
  );
};

export default ProgressPage;
