import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import { mockTutorials, normalizeTutorial } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import tutorialService from "../../services/tutorialService.js";

const TutorialsLibrary = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState("All");

  useEffect(() => {
    let isMounted = true;

    const loadTutorials = async () => {
      try {
        const response = await tutorialService.getTutorials();

        if (!isMounted) {
          return;
        }

        if (response.length) {
          setTutorials(response.map((tutorial, index) => normalizeTutorial(tutorial, index)));
        } else {
          setTutorials(mockTutorials);
          setNotice("No tutorials were returned by the API, so seeded lessons are visible.");
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setTutorials(mockTutorials);
        setNotice(getApiErrorMessage(error));
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

  const tracks = useMemo(
    () => ["All", ...new Set(tutorials.map((tutorial) => tutorial.track))],
    [tutorials],
  );

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tutorial) => {
      const matchesTrack = track === "All" || tutorial.track === track;
      const matchesSearch =
        !search.trim() ||
        [tutorial.title, tutorial.description, tutorial.category, ...(tutorial.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesTrack && matchesSearch;
    });
  }, [search, track, tutorials]);

  if (loading) {
    return <LoadingState label="Loading tutorial library..." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description="Browse structured lessons, filter by track, and open a split-view tutorial detail page with a live code surface."
        eyebrow="Tutorials"
        title="Guided learning modules"
      />

      <Card>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <Input
            icon={<span className="text-sm">S</span>}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tutorials by title, category, or tag"
            value={search}
          />

          <div className="flex flex-wrap gap-2">
            {tracks.map((entry) => (
              <Button
                key={entry}
                onClick={() => setTrack(entry)}
                size="sm"
                variant={track === entry ? "primary" : "secondary"}
              >
                {entry}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {notice ? (
        <NoticeBanner title="Tutorial data fallback" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      {filteredTutorials.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial._id} className="transition duration-200 hover:-translate-y-1">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge tone="accent">{tutorial.track}</Badge>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {tutorial.duration}
                  </span>
                </div>
                <CardTitle className="mt-3">{tutorial.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <p className="text-sm leading-7 text-slate-400">{tutorial.description}</p>

                <div className="flex flex-wrap gap-2">
                  <Badge tone={tutorial.difficulty}>{tutorial.difficulty}</Badge>
                  <Badge tone="neutral">{tutorial.category}</Badge>
                  <Badge tone="neutral">{tutorial.lessons} lessons</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tutorial.tags.map((tag) => (
                    <Badge key={tag} tone="tag">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">{tutorial.trendingScore}</span>
                  <Button
                    as={Link}
                    size="sm"
                    state={{ tutorial, remoteId: tutorial.remoteId }}
                    to={`/tutorials/${tutorial._id}`}
                    variant="secondary"
                  >
                    Open lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          description="Change the search term or track filter to reveal more lessons."
          title="No tutorials matched these filters"
        />
      )}
    </div>
  );
};

export default TutorialsLibrary;
