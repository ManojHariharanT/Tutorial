import { startTransition, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DifficultyPill from "./components/DifficultyPill.jsx";
import HeroIllustration from "./components/HeroIllustration.jsx";
import StatusBadge from "./components/StatusBadge.jsx";
import SurfaceCard from "./components/SurfaceCard.jsx";
import TechLogo from "./components/TechLogo.jsx";
import {
  categoryMenuItems,
  codingProblems,
  companyFilters,
  footerColumns,
  heroHighlights,
  toolboxItems,
  topicCards,
  tutorialLibrary,
  tutorialTabs,
} from "./landingData.js";
import "./landing.css";

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
const pageSize = 5;
const getTabId = (tab) => `tutorial-tab-${tab.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const tableHeaders = [
  { key: "id", label: "#" },
  { key: "name", label: "Problem Name" },
  { key: "difficulty", label: "Difficulty" },
  { key: "topics", label: "Topics" },
];

const AppStoreBadge = ({ type }) => {
  if (type === "play") {
    return (
      <a className="lp-app-badge" href="#footer">
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M4 3 18 12 4 21V3Z" fill="#2563eb" />
        </svg>
        <span>
          <small>Get it on</small>
          <strong>Google Play</strong>
        </span>
      </a>
    );
  }

  return (
    <a className="lp-app-badge" href="#footer">
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="M16.5 13.6c0-2.5 2.1-3.7 2.2-3.8-1.2-1.8-3-2-3.7-2-.9-.1-1.8.5-2.2.5s-1.3-.5-2.1-.5c-2.2 0-4.4 1.9-4.4 5.5 0 1 .2 2 .6 2.9.6 1.6 1.7 3.3 3 3.3.6 0 1.1-.4 2-.4.8 0 1.3.4 2 .4 1.4 0 2.3-1.6 2.8-3.1-.1 0-2.2-.9-2.2-2.8Zm-2.7-7c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.5-.7 1.2-.6 1.9.7 0 1.4-.4 1.7-.9Z"
          fill="#333333"
        />
      </svg>
      <span>
        <small>Download on the</small>
        <strong>App Store</strong>
      </span>
    </a>
  );
};

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [activeCompany, setActiveCompany] = useState("All");
  const [activeTab, setActiveTab] = useState(tutorialTabs[0]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCompany, activeDifficulty, sortConfig]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const filteredTopics = useMemo(
    () =>
      activeDifficulty === "All"
        ? topicCards
        : topicCards.filter((topic) => topic.difficulty === activeDifficulty),
    [activeDifficulty],
  );

  const companyScopedProblems = useMemo(() => {
    const byDifficulty =
      activeDifficulty === "All"
        ? codingProblems
        : codingProblems.filter((problem) => problem.difficulty === activeDifficulty);

    return activeCompany === "All"
      ? byDifficulty
      : byDifficulty.filter((problem) => problem.companies.includes(activeCompany));
  }, [activeCompany, activeDifficulty]);

  const sortedProblems = useMemo(() => {
    const nextProblems = [...companyScopedProblems];

    nextProblems.sort((left, right) => {
      if (sortConfig.key === "difficulty") {
        const delta = difficultyOrder[left.difficulty] - difficultyOrder[right.difficulty];
        return sortConfig.direction === "asc" ? delta : -delta;
      }

      if (sortConfig.key === "topics") {
        const leftValue = left.topics.join(", ");
        const rightValue = right.topics.join(", ");
        return sortConfig.direction === "asc"
          ? leftValue.localeCompare(rightValue)
          : rightValue.localeCompare(leftValue);
      }

      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? left.name.localeCompare(right.name)
          : right.name.localeCompare(left.name);
      }

      return sortConfig.direction === "asc" ? left.id - right.id : right.id - left.id;
    });

    return nextProblems;
  }, [companyScopedProblems, sortConfig]);

  const pageCount = Math.max(1, Math.ceil(sortedProblems.length / pageSize));
  const visibleProblems = sortedProblems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const visibleTutorials = useMemo(
    () => tutorialLibrary.filter((item) => item.category === activeTab),
    [activeTab],
  );

  const handleDifficultyChange = (difficulty) => {
    startTransition(() => setActiveDifficulty(difficulty));
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="lp-page">
      <header className="lp-topnav">
        <div className="lp-container">
          <div className="lp-topnav-row">
            <div className="lp-topnav-left">
              <Link className="lp-logo" to="/">
                <span className="lp-logo-mark">SF</span>
                <span className="lp-logo-copy">
                  <strong>SF Tutorial</strong>
                  <span>Developer learning platform</span>
                </span>
              </Link>

              <nav aria-label="Primary" className="lp-nav-links">
                <a className="lp-nav-link" href="#hero">Home</a>
                <a className="lp-nav-link" href="#coding-problems">Practice Code</a>
                <a className="lp-nav-link" href="/playground">Compilers</a>
                <a className="lp-nav-link" href="#tutorial-library">Articles</a>
                <a className="lp-nav-link" href="#developer-toolbox">Tools</a>
                <div className="lp-category-menu">
                  <button
                    aria-expanded={isCategoryMenuOpen}
                    className="lp-category-toggle"
                    onClick={() => setIsCategoryMenuOpen((open) => !open)}
                    type="button"
                  >
                    Categories
                    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                      <path d="m5 7 5 6 5-6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                    </svg>
                  </button>
                  {isCategoryMenuOpen ? (
                    <div className="lp-category-dropdown">
                      {categoryMenuItems.map((category) => (
                        <a className="lp-category-item" href="#topic-grid" key={category}>
                          <span aria-hidden="true" className="lp-category-dot" />
                          {category}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </nav>
            </div>

            <div className="lp-topnav-right">
              <nav aria-label="Secondary" className="lp-utility-links">
                <a className="lp-utility-link" href="#tutorial-library">Tutorials</a>
                <a className="lp-utility-link" href="#tutorial-library">Courses</a>
                <a className="lp-utility-link" href="#footer">Jobs</a>
              </nav>
              <Link className="lp-login-button" to="/login">Login</Link>
              <button
                aria-label="Toggle mobile navigation"
                className="lp-mobile-toggle"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                type="button"
              >
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                </svg>
              </button>
            </div>
          </div>

          {isMobileMenuOpen ? (
            <div className="lp-mobile-panel">
              <div className="lp-mobile-panel-inner">
                <div className="lp-mobile-links">
                  <a className="lp-nav-link" href="#hero">Home</a>
                  <a className="lp-nav-link" href="#coding-problems">Practice Code</a>
                  <a className="lp-nav-link" href="/playground">Compilers</a>
                  <a className="lp-nav-link" href="#tutorial-library">Articles</a>
                  <a className="lp-nav-link" href="#developer-toolbox">Tools</a>
                  <a className="lp-utility-link" href="#tutorial-library">Tutorials</a>
                  <a className="lp-utility-link" href="#tutorial-library">Courses</a>
                  <a className="lp-utility-link" href="#footer">Jobs</a>
                </div>
                <div className="lp-mobile-categories">
                  {categoryMenuItems.map((category) => (
                    <a className="lp-category-item" href="#topic-grid" key={category}>
                      <span aria-hidden="true" className="lp-category-dot" />
                      {category}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main className="lp-main">
        <div className="lp-container">
          <section className="lp-hero" id="hero">
            <div className="lp-hero-copy">
              <span className="lp-section-kicker">Utility-first learning for engineers</span>
              <h1>Build depth across tutorials, coding drills, and developer tools from one technical workspace.</h1>
              <p>
                SF Tutorial brings together topic grids, sortable interview questions,
                multi-track tutorials, and fast utilities in a layout optimized for scanning,
                comparing, and getting back to code.
              </p>
              <div className="lp-hero-actions">
                <a className="lp-primary-link" href="#coding-problems">Start practicing</a>
                <a className="lp-secondary-link" href="#tutorial-library">Browse tutorials</a>
              </div>
              <div className="lp-hero-metrics" aria-label="Platform metrics">
                <div className="lp-metric">
                  <strong>1.2k+</strong>
                  <span>Practice prompts</span>
                </div>
                <div className="lp-metric">
                  <strong>320</strong>
                  <span>Compiler snippets</span>
                </div>
                <div className="lp-metric">
                  <strong>84</strong>
                  <span>Company tracks</span>
                </div>
                <div className="lp-metric">
                  <strong>24/7</strong>
                  <span>Toolbox access</span>
                </div>
              </div>
            </div>

            <div className="lp-hero-visual">
              <SurfaceCard as="aside" className="lp-code-panel">
                <HeroIllustration />
                <h2>Code-first lesson surfaces</h2>
                <p>
                  Scannable modules, compact previews, and quick transitions from concept to implementation.
                </p>
              </SurfaceCard>

              <div className="lp-hero-visual-grid">
                <SurfaceCard className="lp-hero-side">
                  <h3>Pattern snapshots</h3>
                  <p>ASCII previews stay inline so data structure choices remain visible while you review.</p>
                  <div className="lp-pattern-stack">
                    <div className="lp-pattern-block">
                      <span className="lp-pattern-label">Linked List</span>
                      <pre>{`[4] -> [7] -> [9] -> null`}</pre>
                    </div>
                    <div className="lp-pattern-block">
                      <span className="lp-pattern-label">Tree</span>
                      <pre>{`    8\n   / \\\n  3   10\n / \\    \\\n1   6    14`}</pre>
                    </div>
                    <div className="lp-pattern-block">
                      <span className="lp-pattern-label">Graph</span>
                      <pre>{`A -- B\n|  / |\nC -- D`}</pre>
                    </div>
                  </div>
                </SurfaceCard>

                <SurfaceCard className="lp-hero-side">
                  <h3>What learners do next</h3>
                  <p>Move directly into compiler runs, topic filters, and table-driven interview prep.</p>
                  <div className="lp-pattern-stack">
                    <div className="lp-pattern-block">
                      <span className="lp-pattern-label">Flow</span>
                      <pre>{`Read tutorial\n  -> test snippet\n  -> solve prompt`}</pre>
                    </div>
                  </div>
                </SurfaceCard>
              </div>
            </div>
          </section>

          <section aria-labelledby="feature-grid-title" className="lp-section">
            <div className="lp-section-heading">
              <div>
                <h2 id="feature-grid-title">Featured learning lanes</h2>
                <p>Each card exposes a distinct study mode with concise entry points and status signaling.</p>
              </div>
            </div>
            <div className="lp-feature-grid">
              {heroHighlights.map((item) => (
                <SurfaceCard className="lp-feature-card" key={item.id}>
                  <header>
                    <span aria-hidden="true" className="lp-feature-icon">{item.icon}</span>
                    <StatusBadge tone={item.badge}>{item.badge}</StatusBadge>
                  </header>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a className="lp-inline-link" href={item.href}>
                    {item.cta}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </SurfaceCard>
              ))}
            </div>
          </section>

          <section aria-labelledby="topic-grid-title" className="lp-section" id="topic-grid">
            <div className="lp-section-heading">
              <div>
                <h2 id="topic-grid-title">Topic categories</h2>
                <p>Practice by concept first, then refine by difficulty without leaving the grid.</p>
              </div>
              <div className="lp-filter-row" aria-label="Filter topics by difficulty">
                {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                  <button
                    aria-pressed={activeDifficulty === difficulty}
                    className={`lp-filter-button ${activeDifficulty === difficulty ? "lp-filter-active" : ""}`}
                    key={difficulty}
                    onClick={() => handleDifficultyChange(difficulty)}
                    type="button"
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
            <div className="lp-topic-grid">
              {filteredTopics.map((topic) => (
                <SurfaceCard className="lp-topic-card" key={topic.id}>
                  <div className="lp-topic-top">
                    <div>
                      <h3>{topic.name}</h3>
                      <p>Structured drills and quick-recall prompts</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="lp-topic-indicator"
                      style={{ backgroundColor: topic.accent }}
                    />
                  </div>
                  <div className="lp-topic-meta">
                    <strong>{topic.problemCount} problems</strong>
                    <DifficultyPill difficulty={topic.difficulty} />
                  </div>
                </SurfaceCard>
              ))}
            </div>
          </section>

          <section aria-labelledby="coding-problems-title" className="lp-section" id="coding-problems">
            <div className="lp-section-heading">
              <div>
                <h2 id="coding-problems-title">Coding problems</h2>
                <p>Sort by name, difficulty, or topic mix, and scope the list by target company.</p>
              </div>
            </div>

            <SurfaceCard as="section" className="lp-table-shell">
              <p className="lp-table-meta">
                Difficulty filters stay shared with the topic grid so the page behaves like one coordinated study surface.
              </p>

              <div className="lp-filter-row" aria-label="Problem difficulty filters">
                {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                  <button
                    aria-pressed={activeDifficulty === difficulty}
                    className={`lp-filter-button ${activeDifficulty === difficulty ? "lp-filter-active" : ""}`}
                    key={difficulty}
                    onClick={() => handleDifficultyChange(difficulty)}
                    type="button"
                  >
                    {difficulty}
                  </button>
                ))}
              </div>

              <div className="lp-company-row" aria-label="Company filters">
                {companyFilters.map((company) => (
                  <button
                    className={`lp-company-chip ${activeCompany === company ? "lp-company-active" : ""}`}
                    key={company}
                    onClick={() => setActiveCompany(company)}
                    type="button"
                  >
                    {company}
                  </button>
                ))}
              </div>

              <div className="lp-table-scroll">
                <table className="lp-table">
                  <thead>
                    <tr>
                      {tableHeaders.map((header) => (
                        <th
                          aria-sort={
                            sortConfig.key === header.key
                              ? sortConfig.direction === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                          key={header.key}
                          scope="col"
                        >
                          <button className="lp-table-sort" onClick={() => handleSort(header.key)} type="button">
                            {header.label}
                            <svg aria-hidden="true" fill="none" viewBox="0 0 12 12">
                              <path d="M3 4.5 6 1.5l3 3M9 7.5 6 10.5 3 7.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
                            </svg>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProblems.map((problem) => (
                      <tr key={problem.id}>
                        <td>{problem.id}</td>
                        <td className="lp-problem-title">{problem.name}</td>
                        <td><DifficultyPill difficulty={problem.difficulty} /></td>
                        <td>
                          <div className="lp-topic-tags">
                            {problem.topics.map((topic) => (
                              <span className="lp-topic-tag" key={`${problem.id}-${topic}`}>{topic}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lp-pagination">
                <span>
                  Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedProblems.length)} of {sortedProblems.length}
                </span>
                <nav aria-label="Pagination" className="lp-filter-row">
                  <button
                    className="lp-page-button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    type="button"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                    <button
                      className={`lp-page-button ${currentPage === page ? "lp-page-active" : ""}`}
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      type="button"
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="lp-page-button"
                    disabled={currentPage === pageCount}
                    onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                    type="button"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </SurfaceCard>
          </section>

          <section aria-labelledby="tutorial-library-title" className="lp-section" id="tutorial-library">
            <div className="lp-section-heading">
              <div>
                <h2 id="tutorial-library-title">Tutorial library</h2>
                <p>Switch tabs to move from language fundamentals into web, ML, DevOps, and database tracks.</p>
              </div>
              <div className="lp-tab-row" role="tablist" aria-label="Tutorial categories">
                {tutorialTabs.map((tab) => (
                  <button
                    aria-controls="tutorial-library-panel"
                    aria-selected={activeTab === tab}
                    className={`lp-tab-button ${activeTab === tab ? "lp-tab-active" : ""}`}
                    id={getTabId(tab)}
                    key={tab}
                    onClick={() => startTransition(() => setActiveTab(tab))}
                    role="tab"
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div
              aria-labelledby={getTabId(activeTab)}
              className="lp-library-grid"
              id="tutorial-library-panel"
              role="tabpanel"
            >
              {visibleTutorials.map((item) => (
                <SurfaceCard className="lp-library-card" key={item.id}>
                  <div className="lp-library-top">
                    <TechLogo alt={`${item.title} logo`} lazy logo={item.logo} />
                    <StatusBadge tone="NEW">{item.level}</StatusBadge>
                  </div>
                  <h3>{item.title}</h3>
                  <p>Hands-on notes, examples, and compiler-ready snippets.</p>
                  <div className="lp-library-stats">
                    <span>{item.lessons} lessons</span>
                    <strong>Study</strong>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          </section>

          <section aria-labelledby="developer-toolbox-title" className="lp-section" id="developer-toolbox">
            <div className="lp-section-heading">
              <div>
                <h2 id="developer-toolbox-title">Developer toolbox</h2>
                <p>Compact utilities stay inline so learners can validate payloads, sketch flows, and prep job assets without modal-heavy interruptions.</p>
              </div>
            </div>
            <div className="lp-toolbox-row">
              {toolboxItems.map((tool) => (
                <SurfaceCard className="lp-toolbox-card" key={tool.id}>
                  <a className="lp-tool-link" href={tool.href}>
                    <span aria-hidden="true" className="lp-tool-icon">{tool.icon}</span>
                    <div>
                      <h3>{tool.label}</h3>
                      <p>Open tool</p>
                    </div>
                  </a>
                </SurfaceCard>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="lp-footer" id="footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-copy">
              <Link className="lp-logo" to="/">
                <span className="lp-logo-mark">SF</span>
                <span className="lp-logo-copy">
                  <strong>SF Tutorial</strong>
                  <span>Content-rich UI for technical learners</span>
                </span>
              </Link>
              <p>
                Lightweight navigation, utility-first content density, and code-oriented learning paths for developers who want less chrome and more signal.
              </p>
            </div>

            <div className="lp-footer-columns">
              {footerColumns.map((column) => (
                <div className="lp-footer-column" key={column.title}>
                  <h4>{column.title}</h4>
                  <div className="lp-footer-list">
                    {column.links.map((link) => (
                      <a className="lp-footer-link" href="#hero" key={link}>{link}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lp-app-badges">
              <AppStoreBadge type="app" />
              <AppStoreBadge type="play" />
            </div>
          </div>

          <div className="lp-footer-bottom">
            &copy; 2026 SF Tutorial. Built for developer education, practice, and
            tool-assisted learning.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
