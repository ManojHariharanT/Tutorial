import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import StatCard from "../../components/StatCard.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import { mockProblemSummaries, mockProgressOverview, mockTutorials } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import practiceService from "../../services/practiceService.js";
import progressService from "../../services/progressService.js";
import tutorialService from "../../services/tutorialService.js";

const DashboardPage = () => {
  const [state, setState] = useState({
    loading: true,
    notices: [],
    overview: null,
    tutorials: [],
    problems: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      const notices = [];

      try {
        const [overviewResult, tutorialsResult, problemsResult] = await Promise.allSettled([
          progressService.getOverview(),
          tutorialService.getTutorials(),
          practiceService.getProblems("All"),
        ]);

        if (!isMounted) {
          return;
        }

        const overview =
          overviewResult.status === "fulfilled"
            ? overviewResult.value
            : (() => {
                notices.push("Progress data is temporarily unavailable. Showing default progress stats.");
                return mockProgressOverview;
              })();

        const tutorials =
          tutorialsResult.status === "fulfilled" && tutorialsResult.value.length
            ? tutorialsResult.value
            : (() => {
                notices.push("Tutorial data is using demo content until the API returns lessons.");
                return mockTutorials;
              })();

        const problems =
          problemsResult.status === "fulfilled" && problemsResult.value.length
            ? problemsResult.value
            : (() => {
                notices.push("Practice data is using demo content until the API returns problems.");
                return mockProblemSummaries;
              })();

        setState({
          loading: false,
          notices,
          overview,
          tutorials,
          problems,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState((current) => ({
          ...current,
          loading: false,
          notices: [getApiErrorMessage(error)],
          overview: mockProgressOverview,
          tutorials: mockTutorials,
          problems: mockProblemSummaries,
        }));
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state.loading) {
    return <LoadingState label="Building your dashboard..." />;
  }

  const stats = state.overview?.stats || {
    completedTutorialCount: 0,
    solvedProblemCount: 0,
    totalSubmissions: 0,
    acceptanceRate: 0,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Stay in flow while you learn and practice."
        description="Move between tutorials, live code execution, and evaluated problems from a single workspace."
      />

      {state.notices.length ? (
        <NoticeBanner tone="warning" title="Some sections are using fallback data">
          {state.notices.join(" ")}
        </NoticeBanner>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper="Lessons marked complete"
          label="Completed Tutorials"
          tone="peach"
          value={stats.completedTutorialCount}
        />
        <StatCard
          helper="Problems solved with accepted submissions"
          label="Solved Problems"
          tone="mint"
          value={stats.solvedProblemCount}
        />
        <StatCard
          helper="All recorded problem submissions"
          label="Total Submissions"
          tone="brand"
          value={stats.totalSubmissions}
        />
        <StatCard
          helper="Accepted submissions divided by total submissions"
          label="Acceptance Rate"
          value={`${stats.acceptanceRate}%`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          description="Jump back into the part of the platform that matches your next study session."
          title="Quick Actions"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Link className="rounded-2xl bg-peach-50 p-5 transition hover:bg-peach-100" to="/tutorials">
              <p className="text-lg font-semibold text-slate-900">Read tutorials</p>
              <p className="mt-2 text-sm text-slate-500">
                Explore seeded lessons with language examples.
              </p>
            </Link>
            <Link className="rounded-2xl bg-mint-50 p-5 transition hover:bg-mint-100" to="/playground">
              <p className="text-lg font-semibold text-slate-900">Use playground</p>
              <p className="mt-2 text-sm text-slate-500">
                Execute JavaScript snippets and inspect the console output.
              </p>
            </Link>
            <Link className="rounded-2xl bg-brand-50 p-5 transition hover:bg-brand-100" to="/practice">
              <p className="text-lg font-semibold text-slate-900">Solve problems</p>
              <p className="mt-2 text-sm text-slate-500">
                Work through coding challenges and submit for evaluation.
              </p>
            </Link>
          </div>
        </SectionCard>

        <SectionCard
          description="Seeded content available as soon as the backend is connected to MongoDB."
          title="Platform Content"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Tutorial Library</p>
                <p className="mt-1 text-sm text-slate-500">Browse structured lessons.</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{state.tutorials.length}</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Practice Problems</p>
                <p className="mt-1 text-sm text-slate-500">Focus on evaluated coding tasks.</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{state.problems.length}</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        description="Your most recent submissions are listed here once you start solving problems."
        title="Recent Submission Activity"
      >
        {state.overview?.recentSubmissions?.length ? (
          <div className="space-y-3">
            {state.overview.recentSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
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
            No submissions yet. Open the practice area and submit your first solution.
          </p>
        )}
      </SectionCard>
    </div>
  );
};

export default DashboardPage;
