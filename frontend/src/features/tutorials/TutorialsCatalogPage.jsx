import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockTutorials, normalizeTutorial } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import tutorialService from "../../services/tutorialService.js";
import "../landing/landing.css";

const TutorialsCatalogPage = () => {
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

  const filteredTutorials = useMemo(
    () =>
      tutorials.filter((tutorial) => {
        const matchesTrack = track === "All" || tutorial.track === track;
        const matchesSearch =
          !search.trim() ||
          [tutorial.title, tutorial.description, tutorial.category, ...(tutorial.tags || [])]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchesTrack && matchesSearch;
      }),
    [search, track, tutorials],
  );

  return (
    <div className="lp-page">
      <header className="lp-topnav">
        <div className="lp-container">
          <div className="lp-topnav-row">
            <div className="lp-topnav-left">
              <Link className="lp-logo" to="/">
                <span className="lp-logo-mark">TP</span>
                <span className="lp-logo-copy">
                  <strong>Tutorials Forge</strong>
                  <span>Developer learning platform</span>
                </span>
              </Link>
              <nav aria-label="Primary" className="lp-nav-links">
                <Link className="lp-nav-link" to="/">Home</Link>
                <Link className="lp-nav-link" to="/practice">Practice Code</Link>
                <Link className="lp-nav-link" to="/playground">Compilers</Link>
                <span aria-current="page" className="lp-nav-link">Articles</span>
                <Link className="lp-nav-link" to="/tools">Tools</Link>
              </nav>
            </div>
            <div className="lp-topnav-right">
              <Link className="lp-login-button" to="/login">Login</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="lp-main">
        <div className="lp-container">
          <section className="lp-section">
            <div className="lp-section-heading">
              <div>
                <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
                  Article library
                </h1>
                <p className="lp-table-meta" style={{ marginTop: "0.85rem", maxWidth: "72ch" }}>
                  Browse guided technical articles, filter by learning track, and open a runnable lesson page
                  with examples, objectives, and challenge code.
                </p>
              </div>
            </div>

            <section className="lp-table-shell">
              <div className="lp-app-toolbar">
                <input
                  className="lp-app-input"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search articles by title, category, or tag"
                  value={search}
                />
                <div className="lp-filter-row">
                  {tracks.map((entry) => (
                    <button
                      key={entry}
                      onClick={() => setTrack(entry)}
                      type="button"
                      className={`lp-filter-button ${track === entry ? "lp-filter-active" : ""}`}
                    >
                      {entry}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {notice ? (
              <section className="lp-table-shell" style={{ marginTop: "1.25rem" }}>
                <p className="lp-table-meta">{notice}</p>
              </section>
            ) : null}

            {loading ? (
              <section className="lp-table-shell" style={{ marginTop: "1.5rem" }}>
                <p className="lp-table-meta">Loading article library...</p>
              </section>
            ) : null}

            {!loading && filteredTutorials.length ? (
              <div className="lp-app-grid-2" style={{ marginTop: "1.5rem" }}>
                {filteredTutorials.map((tutorial) => (
                  <article className="lp-card lp-app-card" key={tutorial._id}>
                    <div className="lp-app-card-top">
                      <span className="lp-topic-tag">{tutorial.track}</span>
                      <span className="lp-app-muted">{tutorial.duration}</span>
                    </div>
                    <h2 className="lp-app-title">{tutorial.title}</h2>
                    <p className="lp-table-meta">{tutorial.description}</p>

                    <div className="lp-topic-tags" style={{ marginTop: "1rem" }}>
                      <span className="lp-topic-tag">{tutorial.difficulty}</span>
                      <span className="lp-topic-tag">{tutorial.category}</span>
                      <span className="lp-topic-tag">{tutorial.lessons} lessons</span>
                    </div>

                    <div className="lp-topic-tags" style={{ marginTop: "1rem" }}>
                      {tutorial.tags.map((tag) => (
                        <span className="lp-topic-tag" key={tag}>{tag}</span>
                      ))}
                    </div>

                    <div className="lp-app-card-footer">
                      <span className="lp-app-muted">{tutorial.trendingScore}</span>
                      <Link
                        className="lp-page-button"
                        state={{ tutorial, remoteId: tutorial.remoteId }}
                        to={`/tutorials/${tutorial._id}`}
                      >
                        Open article
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {!loading && !filteredTutorials.length ? (
              <section className="lp-table-shell" style={{ marginTop: "1.5rem" }}>
                <p className="lp-table-meta">No articles matched this search and track combination.</p>
              </section>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
};

export default TutorialsCatalogPage;
