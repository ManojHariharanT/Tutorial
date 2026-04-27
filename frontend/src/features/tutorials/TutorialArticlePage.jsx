import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getMockTutorialById, normalizeTutorial } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import tutorialService from "../../services/tutorialService.js";
import { markDemoTutorialComplete } from "../../utils/demoState.js";
import { runSnippetLocally } from "../../utils/codeRunner.js";
import "../landing/landing.css";

const TutorialArticlePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [tutorial, setTutorial] = useState(location.state?.tutorial || null);
  const [loading, setLoading] = useState(!location.state?.tutorial);
  const [notice, setNotice] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [runError, setRunError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const fallback = getMockTutorialById(id) || location.state?.tutorial || null;
      const remoteId = location.state?.remoteId;

      if (!remoteId) {
        setTutorial(fallback);
        setLoading(false);
        return;
      }

      try {
        const response = await tutorialService.getTutorial(remoteId);

        if (!isMounted) {
          return;
        }

        setTutorial(normalizeTutorial(response));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setTutorial(fallback);
        setNotice(
          `${getApiErrorMessage(error)} Showing the seeded tutorial detail so the lesson remains usable.`,
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [id, location.state?.remoteId, location.state?.tutorial]);

  useEffect(() => {
    if (!tutorial) {
      return;
    }

    const firstExample = tutorial.languageExamples?.[0];
    setActiveLanguage(firstExample?.language || "JavaScript");
  }, [tutorial]);

  const selectedExample = useMemo(
    () =>
      tutorial?.languageExamples?.find((example) => example.language === activeLanguage) ||
      tutorial?.languageExamples?.[0],
    [activeLanguage, tutorial],
  );

  useEffect(() => {
    if (!tutorial) {
      return;
    }

    setCode(selectedExample?.code || tutorial.challenge?.starterCode || "");
  }, [selectedExample, tutorial]);

  const handleRun = async () => {
    if (!selectedExample) {
      return;
    }

    if (selectedExample.language !== "JavaScript") {
      setOutput("");
      setRunError("The embedded runtime currently executes JavaScript examples only.");
      return;
    }

    setIsRunning(true);
    setRunError("");

    const result = await runSnippetLocally(code);
    setOutput(result.stdout);
    setRunError(result.stderr);
    setIsRunning(false);
  };

  const handleComplete = async () => {
    if (!tutorial) {
      return;
    }

    setIsCompleted(true);

    try {
      if (location.state?.remoteId) {
        await tutorialService.markComplete(location.state.remoteId);
      } else {
        markDemoTutorialComplete(tutorial._id);
      }
    } catch (error) {
      markDemoTutorialComplete(tutorial._id);
      setNotice(
        `${getApiErrorMessage(error)} Completion was stored locally so the tutorial still counts in demo mode.`,
      );
    }
  };

  if (loading) {
    return (
      <div className="lp-page">
        <main className="lp-main">
          <div className="lp-container">
            <section className="lp-table-shell">
              <p className="lp-table-meta">Loading article...</p>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="lp-page">
        <main className="lp-main">
          <div className="lp-container">
            <section className="lp-table-shell">
              <p className="lp-table-meta">This article could not be found.</p>
              <Link className="lp-inline-link" to="/tutorials">Back to article library</Link>
            </section>
          </div>
        </main>
      </div>
    );
  }

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
                <Link className="lp-nav-link" to="/tutorials">Articles</Link>
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
            <div className="lp-app-backlink">
              <Link className="lp-inline-link" to="/tutorials">Back to article library</Link>
            </div>
            <div className="lp-section-heading">
              <div>
                <div className="lp-topic-tags" style={{ marginBottom: "0.9rem" }}>
                  <span className="lp-topic-tag">{tutorial.track}</span>
                  <span className="lp-topic-tag">{tutorial.difficulty}</span>
                  <span className="lp-topic-tag">{tutorial.duration}</span>
                </div>
                <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.1rem)", lineHeight: 1.08 }}>
                  {tutorial.title}
                </h1>
                <p className="lp-table-meta" style={{ marginTop: "0.85rem", maxWidth: "72ch" }}>
                  {tutorial.description}
                </p>
              </div>
              <div className="lp-filter-row">
                <button className="lp-page-button lp-page-active" onClick={handleRun} type="button">
                  {isRunning ? "Running..." : "Run example"}
                </button>
                <button
                  className={`lp-page-button ${isCompleted ? "lp-filter-active" : ""}`}
                  onClick={handleComplete}
                  type="button"
                >
                  {isCompleted ? "Marked complete" : "Mark complete"}
                </button>
              </div>
            </div>

            {notice ? (
              <section className="lp-table-shell" style={{ marginBottom: "1.5rem" }}>
                <p className="lp-table-meta">{notice}</p>
              </section>
            ) : null}

            <div className="lp-app-grid-detail">
              <div className="lp-app-stack">
                <section className="lp-table-shell">
                  <h2 className="lp-app-section-title">Lesson overview</h2>
                  <div className="lp-app-meta-block">
                    <p className="lp-app-label">Learning objectives</p>
                    <ul className="lp-app-list">
                      {tutorial.learningObjectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="lp-app-meta-block">
                    <p className="lp-app-label">Prerequisites</p>
                    <div className="lp-topic-tags">
                      {tutorial.prerequisites.map((requirement) => (
                        <span className="lp-topic-tag" key={requirement}>{requirement}</span>
                      ))}
                    </div>
                  </div>
                </section>

                {tutorial.sections.map((section) => (
                  <section className="lp-table-shell" key={section.title}>
                    <h2 className="lp-app-section-title">{section.title}</h2>
                    <p className="lp-table-meta">{section.content}</p>
                    {section.bullets?.length ? (
                      <ul className="lp-app-list" style={{ marginTop: "1rem" }}>
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>

              <div className="lp-app-stack">
                <section className="lp-table-shell">
                  <div className="lp-app-card-top">
                    <h2 className="lp-app-section-title" style={{ margin: 0 }}>Interactive example</h2>
                    <div className="lp-filter-row">
                      {tutorial.languageExamples.map((example) => (
                        <button
                          key={example.language}
                          className={`lp-filter-button ${activeLanguage === example.language ? "lp-filter-active" : ""}`}
                          onClick={() => setActiveLanguage(example.language)}
                          type="button"
                        >
                          {example.language}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="lp-app-editor"
                    onChange={(event) => setCode(event.target.value)}
                    spellCheck={false}
                    value={code}
                  />
                </section>

                <section className="lp-table-shell">
                  <h2 className="lp-app-section-title">{tutorial.challenge?.title || "Output"}</h2>
                  <p className="lp-table-meta">{tutorial.challenge?.prompt}</p>
                  <pre className="lp-app-console">
                    {runError || output || "Run the example to see output here."}
                  </pre>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TutorialArticlePage;
