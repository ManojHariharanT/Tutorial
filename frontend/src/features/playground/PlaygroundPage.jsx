import { useState } from "react";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import SectionCard from "../../components/SectionCard.jsx";
import StatusPill from "../../components/StatusPill.jsx";
import { getApiErrorMessage } from "../../services/api.js";
import playgroundService from "../../services/playgroundService.js";
import { registry } from "../../plugins/index.js";

const defaultSnippet = `const message = "SF Tutorial playground ready";
console.log(message);
console.log([1, 2, 3].map((value) => value * 2));`;

const PlaygroundPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultSnippet);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setError("");

    try {
      const response = await playgroundService.runCode({
        code,
        language,
      });

      setResult(response);
    } catch (runError) {
      setResult(null);
      setError(getApiErrorMessage(runError));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Playground"
        title="Write JavaScript and run it against the backend executor."
        description="This is the simple child_process-based executor for the first iteration. It is scoped to JavaScript and protected by a 5 second timeout."
        actions={
          <>
            <select
              className="form-input min-w-40"
              onChange={(event) => setLanguage(event.target.value)}
              value={language}
            >
              {registry.getAllPlugins().map((plugin) => (
                <option key={plugin.id} value={plugin.id}>
                  {plugin.displayName}
                </option>
              ))}
            </select>
            <button
              className="soft-button-primary"
              disabled={isRunning}
              onClick={handleRun}
              type="button"
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>
          </>
        }
      />

      {error ? (
        <NoticeBanner tone="error" title="Execution failed">
          {error}
        </NoticeBanner>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          description="A lightweight editor keeps the first version simple and dependable."
          title="Editor"
        >
          <textarea
            className="editor-surface"
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            value={code}
          />
        </SectionCard>

        <SectionCard
          description="Execution results come from the Express backend."
          title="Output Console"
        >
          <div className="flex items-center gap-3">
            {result ? <StatusPill>{result.success ? "Executed" : "Runtime Error"}</StatusPill> : null}
            <p className="text-sm text-slate-500">JavaScript only in this version.</p>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100">
            <pre className="whitespace-pre-wrap">
              {error || result?.stderr || result?.stdout || "Run code to see the output here."}
            </pre>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default PlaygroundPage;
