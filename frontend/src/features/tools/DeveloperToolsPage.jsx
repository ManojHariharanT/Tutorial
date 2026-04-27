import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockTools } from "../../config/mockContent.js";
import { recordDemoToolUsage } from "../../utils/demoState.js";
import "../landing/landing.css";

const toBase64 = (value) => {
  const encoded = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(Number.parseInt(hex, 16)),
  );
  return btoa(encoded);
};

const fromBase64 = (value) => {
  const decoded = atob(value);
  const escaped = decoded
    .split("")
    .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
    .join("");

  return decodeURIComponent(escaped);
};

const DeveloperToolsPage = () => {
  const [activeToolId, setActiveToolId] = useState(mockTools[0].id);
  const [input, setInput] = useState(mockTools[0].sampleInput);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [base64Mode, setBase64Mode] = useState("encode");

  const activeTool = useMemo(
    () => mockTools.find((tool) => tool.id === activeToolId) || mockTools[0],
    [activeToolId],
  );

  const handleSelectTool = (tool) => {
    setActiveToolId(tool.id);
    setInput(tool.sampleInput);
    setOutput("");
    setError("");
  };

  const handleRunTool = () => {
    try {
      setError("");

      const nextOutput = (() => {
        switch (activeTool.id) {
          case "json-formatter":
            return JSON.stringify(JSON.parse(input), null, 2);
          case "json-validator": {
            const parsed = JSON.parse(input);
            const keys = Object.keys(parsed);
            return `Valid JSON\nTop-level keys: ${keys.length ? keys.join(", ") : "(none)"}`;
          }
          case "base64-encoder":
            return base64Mode === "encode" ? toBase64(input) : fromBase64(input);
          case "slug-generator":
            return input
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
          default:
            return input;
        }
      })();

      setOutput(nextOutput);
      recordDemoToolUsage(activeTool.id);
    } catch (runError) {
      setOutput("");
      setError(runError instanceof Error ? runError.message : "Tool execution failed.");
    }
  };

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
                <span aria-current="page" className="lp-nav-link">Tools</span>
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
                  Developer tools
                </h1>
                <p className="lp-table-meta" style={{ marginTop: "0.85rem", maxWidth: "72ch" }}>
                  Keep lightweight formatter and utility workflows close to the learning surface so payloads,
                  slugs, and encoded strings are easy to inspect while you study.
                </p>
              </div>
            </div>

            <div className="lp-toolbox-row" style={{ marginTop: "1.25rem" }}>
              {mockTools.map((tool) => (
                <button
                  className="lp-card lp-app-tool-card"
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  type="button"
                >
                  <div className="lp-app-card-top">
                    <span className="lp-topic-tag">{tool.category}</span>
                  </div>
                  <h2 className="lp-app-title">{tool.name}</h2>
                  <p className="lp-table-meta">{tool.description}</p>
                  {activeTool.id === tool.id ? (
                    <span className="lp-inline-link" style={{ marginTop: "1rem" }}>Selected</span>
                  ) : null}
                </button>
              ))}
            </div>

            {error ? (
              <section className="lp-table-shell" style={{ marginTop: "1.5rem" }}>
                <p className="lp-table-meta">{error}</p>
              </section>
            ) : null}

            <div className="lp-app-grid-2" style={{ marginTop: "1.5rem" }}>
              <section className="lp-table-shell">
                <div className="lp-app-card-top">
                  <h2 className="lp-app-section-title" style={{ margin: 0 }}>{activeTool.name}</h2>
                  {activeTool.id === "base64-encoder" ? (
                    <div className="lp-filter-row">
                      <button
                        className={`lp-filter-button ${base64Mode === "encode" ? "lp-filter-active" : ""}`}
                        onClick={() => setBase64Mode("encode")}
                        type="button"
                      >
                        Encode
                      </button>
                      <button
                        className={`lp-filter-button ${base64Mode === "decode" ? "lp-filter-active" : ""}`}
                        onClick={() => setBase64Mode("decode")}
                        type="button"
                      >
                        Decode
                      </button>
                    </div>
                  ) : null}
                </div>
                <textarea
                  className="lp-app-editor"
                  onChange={(event) => setInput(event.target.value)}
                  spellCheck={false}
                  value={input}
                />
                <div style={{ marginTop: "1rem" }}>
                  <button className="lp-page-button lp-page-active" onClick={handleRunTool} type="button">
                    Run tool
                  </button>
                </div>
              </section>

              <section className="lp-table-shell">
                <h2 className="lp-app-section-title">Output</h2>
                <pre className="lp-app-console">{output || "Run a tool to see the result."}</pre>
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DeveloperToolsPage;
