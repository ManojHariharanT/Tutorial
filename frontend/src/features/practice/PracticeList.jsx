import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
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

  if (loading) {
    return <LoadingState label="Loading practice problems..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Use the table view to filter by difficulty, inspect acceptance rates, and jump into the editor-driven problem interface."
        eyebrow="Practice"
        title="Problem set"
      />

      <Card>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto]">
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
        </CardContent>
      </Card>

      {notice ? (
        <NoticeBanner title="Practice data fallback" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      {filteredProblems.length ? (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,2fr)_120px_120px_160px_130px] gap-4 border-b border-white/8 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
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
                className="grid gap-4 px-6 py-5 md:grid-cols-[minmax(0,2fr)_120px_120px_160px_130px] md:items-center"
              >
                <div>
                  <p className="font-semibold text-white">{problem.title}</p>
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
