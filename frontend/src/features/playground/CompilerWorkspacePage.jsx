import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockPlaygroundFiles } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import playgroundService from "../../services/playgroundService.js";
import { recordDemoPlaygroundRun } from "../../utils/demoState.js";
import { runWorkspaceLocally } from "../../utils/codeRunner.js";
import { registry } from "../../plugins/index.js";
import "../landing/landing.css";

const buildWorkspaceCode = (files, activeFileId, primaryLanguage) => {
  const activeFile = files.find((file) => file.id === activeFileId);

  if (!activeFile) {
    return "";
  }

  if (primaryLanguage !== "javascript") {
    return activeFile.content;
  }

  return files
    .filter((file) => file.language === primaryLanguage)
    .map((file) => file.content)
    .join("\n\n");
};

const getDefaultSnippet = (languageId) =>
  registry.getPlugin(languageId)?.defaultSnippets?.[0]?.code || "console.log('New file');";

const CompilerWorkspacePage = () => {
  const [files, setFiles] = useState(mockPlaygroundFiles);
  const [activeFileId, setActiveFileId] = useState(mockPlaygroundFiles[0].id);
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [compilation, setCompilation] = useState(null);

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) || files[0],
    [activeFileId, files],
  );

  const handleChangeFile = (nextValue) => {
    setFiles((current) =>
      current.map((file) => (file.id === activeFileId ? { ...file, content: nextValue } : file)),
    );
  };

  const handleReset = () => {
    setFiles(mockPlaygroundFiles);
    setActiveFileId(mockPlaygroundFiles[0].id);
    setResult(null);
    setError("");
    setNotice("");
    setCompilation(null);
  };

  const handleAddFile = () => {
    const nextIndex = files.length + 1;
    const nextLanguage = activeFile?.language || "javascript";
    const plugin = registry.getPlugin(nextLanguage);
    const ext = plugin?.fileExtensions?.[0] || "txt";
    const nextFile = {
      id: `file-${Date.now()}`,
      name: `snippet-${nextIndex}.${ext}`,
      path: `/src/snippet-${nextIndex}.${ext}`,
      language: nextLanguage,
      content: getDefaultSnippet(nextLanguage),
    };

    setFiles((current) => [...current, nextFile]);
    setActiveFileId(nextFile.id);
  };

  const handleRemoveFile = (fileId) => {
    setFiles((current) => {
      if (current.length === 1) {
        return current;
      }

      const nextFiles = current.filter((file) => file.id !== fileId);

      if (fileId === activeFileId && nextFiles.length) {
        setActiveFileId(nextFiles[0].id);
      }

      return nextFiles;
    });
  };

  const handleLanguageChange = (languageId) => {
    const plugin = registry.getPlugin(languageId);
    const ext = plugin?.fileExtensions?.[0] || "txt";

    setFiles((current) =>
      current.map((file) =>
        file.id === activeFileId
          ? {
              ...file,
              language: languageId,
              name: file.name.replace(/\.[^/.]+$/, "") + "." + ext,
              path: file.path.replace(/\.[^/.]+$/, "") + "." + ext,
              content: getDefaultSnippet(languageId),
            }
          : file,
      ),
    );
    setResult(null);
    setError("");
    setCompilation(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError("");
    setNotice("");
    setCompilation(null);

    try {
      const primaryLanguage = activeFile.language;
      const response = await playgroundService.runCode({
        code: buildWorkspaceCode(files, activeFileId, primaryLanguage),
        language: primaryLanguage,
      });

      setResult(response);
      setCompilation(response.compilation || null);
      recordDemoPlaygroundRun();
    } catch (runError) {
      const fallback = await runWorkspaceLocally(files, activeFileId);
      setNotice(
        `${getApiErrorMessage(runError)} The local playground runtime is active for this session.`,
      );
      setResult(fallback);
      setError(fallback.stderr);
      recordDemoPlaygroundRun();
    } finally {
      setIsRunning(false);
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
                <span className="lp-nav-link" aria-current="page">Compilers</span>
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
            <div className="lp-section-heading">
              <div>
                <h1>Compiler workspace</h1>
                <p>
                  Edit JavaScript, Python, or SF Lang files, switch between snippets,
                  and run them with the backend executor or the local JavaScript fallback.
                </p>
              </div>
              <div className="lp-filter-row">
                <button className="lp-page-button" onClick={handleReset} type="button">
                  Reset files
                </button>
                <button className="lp-page-button lp-page-active" onClick={handleRun} type="button">
                  {isRunning ? "Running..." : activeFile.language === "javascript" ? "Run workspace" : "Run active file"}
                </button>
              </div>
            </div>

            {notice ? (
              <section className="lp-table-shell" style={{ marginBottom: "1.5rem" }}>
                <p className="lp-table-meta">{notice}</p>
              </section>
            ) : null}

            <div
              style={{
                display: "grid",
                gap: "1.5rem",
                gridTemplateColumns: "320px minmax(0, 1fr)",
                alignItems: "start",
              }}
            >
              <section className="lp-table-shell">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Files</h2>
                  <button className="lp-page-button" onClick={handleAddFile} type="button">
                    New file
                  </button>
                </div>

                <div style={{ display: "grid", gap: "0.85rem" }}>
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setActiveFileId(file.id)}
                      type="button"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        borderRadius: "20px",
                        border: file.id === activeFileId ? "1px solid #27ae60" : "1px solid #d7e2da",
                        background: file.id === activeFileId ? "#f2fbf6" : "#ffffff",
                        padding: "1rem",
                        display: "grid",
                        gap: "0.45rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "1rem",
                            color: "#1f2933",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </strong>
                        <span className="lp-topic-tag">{registry.getPlugin(file.language)?.displayName || file.language}</span>
                      </div>
                      <span style={{ color: "#73808c", fontSize: "0.95rem" }}>{file.path}</span>
                      <div>
                        <span
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemoveFile(file.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              handleRemoveFile(file.id);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          className="lp-inline-link"
                        >
                          Remove
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <div style={{ display: "grid", gap: "1.5rem" }}>
                <section className="lp-table-shell">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{activeFile.name}</h2>
                      <p className="lp-table-meta" style={{ marginTop: "0.35rem" }}>
                        Editing {activeFile.path}
                      </p>
                    </div>

                    <select
                      aria-label="Choose file language"
                      className="lp-company-chip"
                      onChange={(event) => handleLanguageChange(event.target.value)}
                      style={{ background: "#ffffff" }}
                      value={activeFile.language}
                    >
                      {registry.getAllPlugins().map((plugin) => (
                        <option key={plugin.id} value={plugin.id}>
                          {plugin.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    onChange={(event) => handleChangeFile(event.target.value)}
                    spellCheck={false}
                    value={activeFile.content}
                    style={{
                      width: "100%",
                      minHeight: "420px",
                      borderRadius: "20px",
                      border: "1px solid #d7e2da",
                      background: "#fcfdfc",
                      color: "#1f2933",
                      padding: "1.25rem",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      resize: "vertical",
                    }}
                  />
                </section>

                <section className="lp-table-shell">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <h2 style={{ margin: 0, fontSize: "1.3rem" }}>Console output</h2>
                      <p className="lp-table-meta" style={{ marginTop: "0.35rem" }}>
                        Runtime messages and compiler output appear here.
                      </p>
                    </div>
                    <span className="lp-topic-tag">
                      {error ? "Runtime Error" : result?.success ? "Executed" : "Ready"}
                    </span>
                  </div>

                  <pre
                    style={{
                      margin: 0,
                      minHeight: "180px",
                      borderRadius: "20px",
                      border: "1px solid #d7e2da",
                      background: "#101723",
                      color: "#edf2f7",
                      padding: "1.25rem",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.98rem",
                      lineHeight: 1.7,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    }}
                  >
                    {error || result?.stderr || result?.stdout || "No output yet."}
                  </pre>

                  {compilation ? (
                    <div style={{ marginTop: "1rem", display: "grid", gap: "0.9rem" }}>
                      <p className="lp-table-meta" style={{ margin: 0 }}>
                        Compiler metadata
                      </p>
                      <pre
                        style={{
                          margin: 0,
                          borderRadius: "20px",
                          border: "1px solid #d7e2da",
                          background: "#f7faf8",
                          color: "#1f2933",
                          padding: "1rem 1.1rem",
                          whiteSpace: "pre-wrap",
                          fontSize: "0.92rem",
                          lineHeight: 1.65,
                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        }}
                      >
                        {JSON.stringify(compilation, null, 2)}
                      </pre>
                    </div>
                  ) : null}
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CompilerWorkspacePage;
