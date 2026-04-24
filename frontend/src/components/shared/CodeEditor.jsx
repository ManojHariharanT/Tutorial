import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import Tabs, { TabsList, TabsTrigger } from "../ui/Tabs.jsx";
import { cn } from "../../utils/classNames.js";
import { LSPClient } from "../../services/lspClient.js";
import { registry } from "../../plugins/index.js";

const normalizeLanguages = (languages) =>
  languages.map((language) =>
    typeof language === "string"
      ? { id: language, label: registry.getPlugin(language)?.displayName || language }
      : {
          id: language.id,
          label: language.label || registry.getPlugin(language.id)?.displayName || language.id,
        },
  );

const CodeEditor = ({
  value,
  onChange,
  title = "Editor",
  description = "",
  activeLanguage = "javascript",
  languages = [],
  onLanguageChange,
  readOnly = false,
  minHeight = "min-h-[26rem]",
  className,
  headerActions = null,
}) => {
  const languageOptions = normalizeLanguages(languages);
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const lspClientRef = useRef(null);

  useEffect(() => {
    return () => {
      if (lspClientRef.current) {
        lspClientRef.current.disconnect();
      }
    };
  }, []);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    const plugin = registry.getPlugin(activeLanguage);
    
    // Register our custom language dynamically if grammar is provided
    if (plugin && plugin.grammar && !monaco.languages.getLanguages().some((l) => l.id === plugin.id)) {
      monaco.languages.register({ id: plugin.id });
      // Apply syntax highlighting rules (Mocking Monaco's config map for custom grammar)
      monaco.languages.setMonarchTokensProvider(plugin.id, {
        keywords: plugin.grammar.keywords,
        tokenizer: {
          root: [
            // Identifiers and keywords
            [/[a-zA-Z_]\w*/, {
              cases: {
                "@keywords": "keyword",
                "@default": "identifier"
              }
            }],
            // Numbers
            [/\d+(\.\d+)?/, "number"],
            // Strings
            [/"([^"\\]|\\.)*"/, "string"],
            [/'([^'\\]|\\.)*'/, "string"],
            // Comments
            [/\/\/.*$/, "comment"],
            // Operators and punctuation
            [/[+\-*/=<>!&|^%]+/, "operator"],
            [/[(){}\[\],;.]/, "delimiter"],
          ]
        }
      });
    }

    if (plugin && plugin.lspServerUrl) {
      setupLsp(editor, monaco, activeLanguage, plugin.lspServerUrl);
    }
  };

  const setupLsp = async (editor, monaco, lang, lspUrl) => {
    if (lspClientRef.current) {
      lspClientRef.current.disconnect();
    }

    const client = new LSPClient(lang, "file:///fake-doc." + lang, lspUrl);
    lspClientRef.current = client;

    // We configure diagnostics callback from the server
    client.onDiagnostics = (diagnostics) => {
      const markers = diagnostics.map((diag) => ({
        severity: diag.severity === 1 ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
        startLineNumber: diag.range.start.line + 1,
        startColumn: diag.range.start.character + 1,
        endLineNumber: diag.range.end.line + 1,
        endColumn: diag.range.end.character + 1,
        message: diag.message,
        source: diag.source,
      }));
      // Assign markers for the model
      monaco.editor.setModelMarkers(editor.getModel(), "lsp", markers);
    };

    try {
      await client.connect();
      // Send initial content
      client.notifyChange(editor.getValue());

      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: async (model, position) => {
          const lspCompletions = await client.getCompletions({
            line: position.lineNumber - 1,
            character: position.column - 1,
          });

          return {
            suggestions: lspCompletions.map((item) => ({
              label: item.label,
              kind: item.kind,
              detail: item.detail,
              insertText: item.insertText || item.label,
            })),
          };
        },
      });

      monaco.languages.registerHoverProvider(lang, {
        provideHover: async (model, position) => {
          const hoverResult = await client.getHover({
            line: position.lineNumber - 1,
            character: position.column - 1,
          });
          return hoverResult;
        },
      });

    } catch (e) {
      console.error("Failed to connect to LSP", e);
    }
  };

  const handleEditorChange = (newValue) => {
    if (lspClientRef.current) {
      lspClientRef.current.notifyChange(newValue);
    }
    onChange?.(newValue || "");
  };

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface-950/92 h-full", className)}>
      <div className="flex flex-col gap-4 border-b border-white/8 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {languages.length ? (
            <Tabs onValueChange={onLanguageChange} value={activeLanguage}>
              <TabsList>
                {languageOptions.map((language) => (
                  <TabsTrigger key={language.id} value={language.id}>
                    {language.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : null}
          {headerActions}
        </div>
      </div>

      <div className={cn("relative w-full flex-1", minHeight)}>
        <Editor
          height="100%"
          language={activeLanguage}
          theme="vs-dark"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
