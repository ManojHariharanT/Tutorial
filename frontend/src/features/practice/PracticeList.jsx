import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent } from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import { getMockProblemsByDifficulty, normalizeProblemSummary } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import practiceService from "../../services/practiceService.js";

const filters = ["All", "Easy", "Medium", "Hard"];

const PracticeList = () => {
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProblems = async () => {
      setLoading(true);
      setNotice("");

      try {
        const response = await practiceService.getProblems(difficulty);

        if (!isMounted) {
          return;
        }

        if (response.length) {
          setProblems(response.map((problem, index) => normalizeProblemSummary(problem, index)));
        } else {
          setProblems(getMockProblemsByDifficulty(difficulty));
          setNotice("No problems were returned by the API, so seeded challenges are visible.");
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProblems(getMockProblemsByDifficulty(difficulty));
        setNotice(getApiErrorMessage(error));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProblems();

    return () => {
      isMounted = false;
    };
  }, [difficulty]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) =>
      [problem.title, problem.description, problem.category, ...(problem.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [problems, search]);

  const stats = useMemo(() => {
    const visibleCount = filteredProblems.length;
    const averageAcceptance = visibleCount
      ? Math.round(
          filteredProblems.reduce((total, problem) => total + (problem.acceptanceRate || 0), 0) /
            visibleCount,
        )
      : 0;

    return {
      visibleCount,
      easyCount: filteredProblems.filter((problem) => problem.difficulty === "Easy").length,
      averageAcceptance,
    };
  }, [filteredProblems]);

  if (loading) {
    return <LoadingState label="Loading practice problems..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Filter by difficulty, scan the current queue, and jump straight into the editor-backed problem workspace."
        eyebrow="Practice"
        title="Problem set"
        actions={
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Visible
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{stats.visibleCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Avg. acceptance
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{stats.averageAcceptance}%</p>
            </div>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Find a problem
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Search by title, tag, or category, then narrow the set to the difficulty you want
                to work on right now.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <Input
                icon={<span className="text-sm">F</span>}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, tag, or category"
                value={search}
              />

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => setDifficulty(filter)}
                    size="sm"
                    variant={difficulty === filter ? "primary" : "secondary"}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <SectionCard
          description="A quick read on the current practice queue."
          title="Queue Snapshot"
        >
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">Open problems</p>
              <p className="mt-1 text-sm text-slate-500">Visible in the current filter set.</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.visibleCount}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">Easy starts</p>
              <p className="mt-1 text-sm text-slate-500">Good warm-up options in this view.</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.easyCount}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">Acceptance</p>
              <p className="mt-1 text-sm text-slate-500">Average success rate across visible rows.</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {stats.averageAcceptance}%
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {notice ? (
        <NoticeBanner title="Practice data fallback" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      {filteredProblems.length ? (
        <Card className="overflow-hidden">
          <div className="border-b border-white/8 px-6 py-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Current list
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {difficulty === "All" ? "All practice problems" : `${difficulty} problems`}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {stats.visibleCount} problem{stats.visibleCount === 1 ? "" : "s"} match the
                  current search and difficulty filters.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-[minmax(0,2.1fr)_140px_120px_220px_130px] gap-4 border-b border-white/8 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Acceptance</span>
            <span>Tags</span>
            <span />
          </div>
          <div className="divide-y divide-white/8">
            {filteredProblems.map((problem) => (
              <div
                key={problem._id}
                className="grid gap-4 px-6 py-5 md:grid-cols-[minmax(0,2.1fr)_140px_120px_220px_130px] md:items-center"
              >
                <div>
                  <p className="font-semibold text-white">{problem.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1">
                      {problem.category}
                    </span>
                    <span>{problem.estimatedTime}</span>
                    <span>{problem.completions} completions</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{problem.description}</p>
                </div>
                <div>
                  <Badge tone={problem.difficulty}>{problem.difficulty}</Badge>
                </div>
                <p className="text-sm text-slate-300">{problem.acceptanceRate}%</p>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} tone="tag">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  as={Link}
                  className="w-full md:w-auto"
                  size="sm"
                  state={{ problem, remoteId: problem.remoteId }}
                  to={`/practice/${problem._id}`}
                  variant="secondary"
                >
                  Solve
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState
          description="Try another difficulty or a broader search query."
          title="No practice problems matched these filters"
        />
      )}
    </div>
  );
};

export default PracticeList;
