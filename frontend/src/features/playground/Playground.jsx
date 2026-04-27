import { useEffect, useMemo, useState, useRef } from "react";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import CodeEditor from "../../components/shared/CodeEditor.jsx";
import Console from "../../components/shared/Console.jsx";
import SplitLayout from "../../components/shared/SplitLayout.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import { mockPlaygroundFiles } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import playgroundService from "../../services/playgroundService.js";
import { runWorkspaceLocally } from "../../utils/codeRunner.js";
import { recordDemoPlaygroundRun } from "../../utils/demoState.js";
import FileExplorer from "./FileExplorer.jsx";
import { registry } from "../../plugins/index.js";

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

const getLanguageOption = (languageId, metadata = null) => {
  const plugin = registry.getPlugin(languageId);

  return {
    id: languageId,
    label: plugin?.displayName || metadata?.displayName || languageId,
    meta: metadata,
  };
};

const getDefaultSnippet = (languageId) =>
  registry.getPlugin(languageId)?.defaultSnippets?.[0]?.code || "console.log('New file');";

const Playground = () => {
  const [files, setFiles] = useState(mockPlaygroundFiles);
  const [activeFileId, setActiveFileId] = useState(mockPlaygroundFiles[0].id);
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [compilation, setCompilation] = useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [editorHeight, setEditorHeight] = useState(50); // percentage
  const [fileExplorerWidth, setFileExplorerWidth] = useState(260); // pixels
  const containerRef = useRef(null);
  const layoutRef = useRef(null);
  const isDraggingVertical = useRef(false);
  const isDraggingHorizontal = useRef(false);

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) || files[0],
    [activeFileId, files],
  );

  const languageOptions = useMemo(() => {
    if (supportedLanguages.length) {
      return supportedLanguages
        .filter((entry) => registry.getPlugin(entry.id))
        .map((entry) => getLanguageOption(entry.id, entry));
    }

    return registry.getAllPlugins().map((plugin) => getLanguageOption(plugin.id));
  }, [supportedLanguages]);

  const activeRuntime = useMemo(() => {
    if (result?.language === activeFile?.language && result?.runtime) {
      return result.runtime;
    }

    return supportedLanguages.find((entry) => entry.id === activeFile?.language) || null;
  }, [activeFile?.language, result, supportedLanguages]);

  useEffect(() => {
    let ignore = false;

    const loadSupportedLanguages = async () => {
      try {
        const languages = await playgroundService.listLanguages();
        if (!ignore && languages.length) {
          setSupportedLanguages(languages);
        }
      } catch (loadError) {
        if (!ignore) {
          setNotice(
            `${getApiErrorMessage(loadError)} Showing built-in language options until the backend responds.`,
          );
        }
      }
    };

    loadSupportedLanguages();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChangeFile = (nextValue) => {
    setFiles((current) =>
      current.map((file) => (file.id === activeFileId ? { ...file, content: nextValue } : file)),
    );
  };

  const handleAddFile = () => {
    const nextIndex = files.length + 1;
    const nextLanguage = activeFile?.language || languageOptions[0]?.id || "javascript";
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
        code: buildWorkspaceCode(files, activeFileId, primaryLanguage),
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

  const handleMouseDownVertical = () => {
    isDraggingVertical.current = true;
  };

  const handleMouseDownHorizontal = () => {
    isDraggingHorizontal.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Handle vertical drag (editor/console split)
      if (isDraggingVertical.current && containerRef.current) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;

        if (newHeight > 20 && newHeight < 80) {
          setEditorHeight(newHeight);
        }
      }

      // Handle horizontal drag (file explorer width)
      if (isDraggingHorizontal.current && layoutRef.current) {
        const layout = layoutRef.current;
        const layoutRect = layout.getBoundingClientRect();
        const newWidth = e.clientX - layoutRect.left;

        if (newWidth > 150 && newWidth < 600) {
          setFileExplorerWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingVertical.current = false;
      isDraggingHorizontal.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const runLabel = activeFile.language === "javascript" ? "Run workspace" : "Run active file";

  const editorContent = (
    <Card className="overflow-hidden p-0 h-full flex flex-col">
      <CodeEditor
        description={`Editing ${activeFile.path}`}
        onChange={handleChangeFile}
        title={activeFile.name}
        value={activeFile.content}
        activeLanguage={activeFile.language}
        languages={languageOptions}
        minHeight="min-h-0"
        onLanguageChange={(lang) => {
          const plugin = registry.getPlugin(lang);
          const ext = plugin?.fileExtensions?.[0] || "txt";
          setFiles((current) =>
            current.map((file) =>
              file.id === activeFileId
                ? {
                    ...file,
                    language: lang,
                    name: file.name.replace(/\.[^/.]+$/, "") + "." + ext,
                    path: file.path.replace(/\.[^/.]+$/, "") + "." + ext,
                  }
                : file,
            ),
          );
        }}
      />
    </Card>
  );

  const consoleContent = (
    <Console
      description="The output console reuses the same surface pattern as tutorials and practice."
      error={error || result?.stderr}
      output={result?.stdout}
      status={error ? "Runtime Error" : result?.success ? "Executed" : "Ready"}
      title="Console output"
    />
  );

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Button onClick={handleReset} variant="secondary">
              Reset files
            </Button>
            <Button onClick={handleRun} variant="gradient">
              {isRunning ? "Running..." : runLabel}
            </Button>
          </>
        }
        description="Edit JavaScript, Python, or SFLang files, switch context with the explorer, and run them through the backend executor or the local JavaScript fallback."
        eyebrow="Playground"
        title="Code sandbox"
      />

      {notice ? (
        <NoticeBanner title="Playground runtime notice" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      <div ref={layoutRef} className="flex gap-0 h-[70vh]">
        <div style={{ width: `${fileExplorerWidth}px` }} className="overflow-hidden">
          <FileExplorer
            activeFileId={activeFileId}
            files={files}
            onAddFile={handleAddFile}
            onRemoveFile={handleRemoveFile}
            onSelectFile={setActiveFileId}
          />
        </div>
        <div
          onMouseDown={handleMouseDownHorizontal}
          className="w-1 bg-gradient-to-b from-transparent via-slate-400 to-transparent cursor-col-resize hover:via-slate-300 transition-colors"
        />

        <div ref={containerRef} className="flex flex-col gap-0 min-w-0 flex-1 h-full">
          <div style={{ height: `${editorHeight}%` }} className="min-h-0 overflow-hidden pb-3">
            {editorContent}
          </div>
          <div
            onMouseDown={handleMouseDownVertical}
            className="h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent cursor-row-resize hover:via-slate-300 transition-colors"
          />
          <div style={{ height: `${100 - editorHeight}%` }} className="min-h-0 overflow-hidden pt-3">
            {consoleContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;

