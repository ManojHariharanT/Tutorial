import { useMemo, useState } from "react";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import CodeEditor from "../../components/shared/CodeEditor.jsx";
import Console from "../../components/shared/Console.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { mockPlaygroundFiles } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import playgroundService from "../../services/playgroundService.js";
import { runWorkspaceLocally } from "../../utils/codeRunner.js";
import { recordDemoPlaygroundRun } from "../../utils/demoState.js";
import FileExplorer from "./FileExplorer.jsx";
import CompilerExplorer from "./CompilerExplorer.jsx";
import { registry } from "../../plugins/index.js";

const buildWorkspaceCode = (files, primaryLanguage) =>
  files
    .filter((file) => file.language === primaryLanguage)
    .map((file) => file.content)
    .join("\n\n");

const Playground = () => {
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

  const handleAddFile = () => {
    const nextIndex = files.length + 1;
    const nextFile = {
      id: `file-${Date.now()}`,
      name: `snippet-${nextIndex}.js`,
      path: `/src/snippet-${nextIndex}.js`,
      language: "javascript",
      content: registry.getPlugin("javascript")?.defaultSnippets[0].code || "console.log('New file');",
    };

    setFiles((current) => [...current, nextFile]);
    setActiveFileId(nextFile.id);
  };

  const handleRemoveFile = (fileId) => {
    setFiles((current) => {
      const nextFiles = current.filter((file) => file.id !== fileId);

      if (fileId === activeFileId && nextFiles.length) {
        setActiveFileId(nextFiles[0].id);
      }

      return nextFiles;
    });
  };

  const handleReset = () => {
    setFiles(mockPlaygroundFiles);
    setActiveFileId(mockPlaygroundFiles[0].id);
    setResult(null);
    setCompilation(null);
    setError("");
    setNotice("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError("");
    setCompilation(null);

    try {
      const primaryLanguage = activeFile.language;
      const response = await playgroundService.runCode({
        code: buildWorkspaceCode(files, primaryLanguage),
        language: primaryLanguage,
      });

      setResult(response);
      if (response.compilation) {
        setCompilation(response.compilation);
      }
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

  const isSFLang = activeFile.language === "sflang";

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={handleReset} variant="secondary">
              Reset files
            </Button>
            <Button onClick={handleRun} variant="gradient">
              {isRunning ? "Running..." : "Run workspace"}
            </Button>
          </>
        }
        description="Edit multiple files, switch context with the explorer, and run the workspace through the backend executor or the local runtime fallback."
        eyebrow="Playground"
        title="Code sandbox"
      />

      {notice ? (
        <NoticeBanner title="Playground runtime notice" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      <div className={`grid gap-6 ${isSFLang ? "xl:grid-cols-[260px_1fr_400px]" : "xl:grid-cols-[300px_minmax(0,1fr)]"}`}>
        <FileExplorer
          activeFileId={activeFileId}
          files={files}
          onAddFile={handleAddFile}
          onRemoveFile={handleRemoveFile}
          onSelectFile={setActiveFileId}
        />

        <Card className="overflow-hidden p-0">
          <CodeEditor
            description={`Editing ${activeFile.path}`}
            onChange={handleChangeFile}
            title={activeFile.name}
            value={activeFile.content}
            activeLanguage={activeFile.language}
            languages={registry.getAllPlugins().map(p => p.id)}
            onLanguageChange={(lang) => {
               const plugin = registry.getPlugin(lang);
               const ext = plugin?.fileExtensions?.[0] || 'js';
               setFiles(curr => curr.map(f => f.id === activeFileId ? {
                 ...f, 
                 language: lang,
                 name: f.name.replace(/\.[^/.]+$/, "") + "." + ext,
                 path: f.path.replace(/\.[^/.]+$/, "") + "." + ext
               } : f));
            }}
          />
        </Card>

        {isSFLang && <CompilerExplorer compilation={compilation} />}
      </div>

      <Console
        description="The output console reuses the same surface pattern as tutorials and practice."
        error={error || result?.stderr}
        output={result?.stdout}
        status={error ? "Runtime Error" : result?.success ? "Executed" : "Ready"}
        title="Console output"
      />
    </div>
  );
};

export default Playground;

