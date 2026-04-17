import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import StatCard from "../../components/StatCard.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import Tooltip from "../../components/ui/Tooltip.jsx";
import { normalizeProgressOverview } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import progressService from "../../services/progressService.js";
import { getDemoProgressOverview } from "../../utils/demoState.js";

const heatmapTone = {
  0: "bg-white/5",
  1: "bg-accent-400/25",
  2: "bg-accent-400/45",
  3: "bg-accent-400/65",
  4: "bg-accent-300",
};

const DashboardProgress = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      const demoOverview = getDemoProgressOverview();

      try {
        const response = await progressService.getOverview();

        if (!isMounted) {
          return;
        }

        const normalized = normalizeProgressOverview(response);
        setOverview({
          ...demoOverview,
          ...normalized,
          activity: demoOverview.activity,
          pathProgress: demoOverview.pathProgress,
          toolsUsed: demoOverview.toolsUsed,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setOverview(demoOverview);
        setNotice(getApiErrorMessage(error));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  const activityWeeks = useMemo(() => {
    if (!overview?.activity) {
      return [];
    }

    const chunks = [];
    for (let index = 0; index < overview.activity.length; index += 7) {
      chunks.push(overview.activity.slice(index, index + 7));
    }
    return chunks;
  }, [overview?.activity]);

  if (loading) {
    return <LoadingState label="Loading progress dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Review aggregate stats, recent execution patterns, and how each learning path is progressing over time."
        eyebrow="Progress"
        title="Performance dashboard"
      />

      {notice ? (
        <NoticeBanner title="Progress fallback" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper="Tutorials completed across the current workspace"
          label="Tutorials done"
          tone="brand"
          value={overview.stats.completedTutorialCount}
        />
        <StatCard
          helper="Accepted or locally recorded problem completions"
          label="Problems solved"
          tone="mint"
          value={overview.stats.solvedProblemCount}
        />
        <StatCard
          helper="All recorded submissions in API or local demo history"
          label="Submissions"
          tone="peach"
          value={overview.stats.totalSubmissions}
        />
        <StatCard
          helper="Acceptance rate across the tracked submission history"
          label="Acceptance"
          value={`${overview.stats.acceptanceRate}%`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Activity heatmap</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto pt-4">
            <div className="flex gap-2">
              {activityWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid gap-2">
                  {week.map((day) => (
                    <Tooltip
                      key={day.date}
                      content={`${day.date}: ${day.count} activity event${day.count === 1 ? "" : "s"}`}
                    >
                      <div className={`h-6 w-6 rounded-md ${heatmapTone[day.level]}`} />
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning path progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            {overview.pathProgress.map((path) => (
              <div key={path.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{path.title}</p>
                  <Badge tone="neutral">{path.progress}%</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{path.description}</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-400"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Completed tutorials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {overview.completedTutorials.length ? (
              overview.completedTutorials.map((tutorial) => (
                <div key={tutorial._id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className="font-semibold text-white">{tutorial.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{tutorial.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No tutorials completed yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {overview.recentSubmissions.length ? (
              overview.recentSubmissions.map((submission) => (
                <div
                  key={submission._id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/4 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{submission.problemId.title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {submission.passed}/{submission.total} tests passed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={submission.problemId.difficulty}>{submission.problemId.difficulty}</Badge>
                    <Badge tone={submission.status === "Accepted" ? "easy" : "medium"}>
                      {submission.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No submission history is available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardProgress;
