import { useEffect, useMemo, useState } from "react";
import Badge from "../../components/ui/Badge.jsx";
import Card from "../../components/ui/Card.jsx";
import Tabs, { TabsList, TabsTrigger } from "../../components/ui/Tabs.jsx";
import { registry } from "../../plugins/index.js";

const CompilerExplorer = ({
  activeLanguage,
  compilation,
  result,
  runtime,
  supportedLanguages = [],
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const languageLabel = registry.getPlugin(activeLanguage)?.displayName || activeLanguage;
  const hasCompilationArtifacts = activeLanguage === "sflang" && Boolean(compilation);

  useEffect(() => {
    setActiveTab(hasCompilationArtifacts ? "wat" : "overview");
  }, [activeLanguage, hasCompilationArtifacts]);

  const irText = useMemo(() => {
    if (!compilation?.ir) return "";

    return compilation.ir
      .map((block) => {
        let text = `Block ${block.id} (${block.name}):\n`;
        block.instructions.forEach((inst) => {
          text += `  ${inst.target ? `${inst.target} = ` : ""}${inst.op} ${
            inst.args ? inst.args.join(", ") : ""
          }\n`;
        });
        return text;
      })
      .join("\n");
  }, [compilation?.ir]);

  const supportedSummary = useMemo(
    () =>
      supportedLanguages.length
        ? supportedLanguages
            .map((entry) => registry.getPlugin(entry.id)?.displayName || entry.displayName || entry.id)
            .join(", ")
        : "JavaScript, Python, SFLang",
    [supportedLanguages],
  );

  const runStatus = result
    ? result.success
      ? "Last run succeeded"
      : "Last run failed"
    : "Ready";

  return (
    <Card className="flex h-full flex-col border-surface-800 bg-surface-950/50 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">
            Compiler Explorer
          </h3>
          <p className="mt-1 text-xs text-slate-500">{languageLabel}</p>
        </div>

        {hasCompilationArtifacts ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-surface-900/50">
              <TabsTrigger value="wat" className="text-[10px] uppercase">
                WASM (WAT)
              </TabsTrigger>
              <TabsTrigger value="ir" className="text-[10px] uppercase">
                SSA IR
              </TabsTrigger>
              <TabsTrigger value="js" className="text-[10px] uppercase">
                JS Target
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <Badge tone="neutral">{runStatus}</Badge>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {hasCompilationArtifacts ? (
          <div className="font-mono text-[13px] leading-relaxed">
            {activeTab === "wat" && (
              <pre className="text-cyan-400">
                <code>{compilation.watCode || "No WASM generated."}</code>
              </pre>
            )}
            {activeTab === "ir" && (
              <pre className="text-purple-400">
                <code>{irText || "No IR generated."}</code>
              </pre>
            )}
            {activeTab === "js" && (
              <pre className="text-emerald-400">
                <code>{compilation.jsCode || "No JavaScript target generated."}</code>
              </pre>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Language</p>
                <p className="mt-2 font-medium text-white">{languageLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Runtime</p>
                <p className="mt-2 break-all font-medium text-white">
                  {runtime?.command || "Waiting for backend runtime info"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {runtime?.executionType === "compiled"
                    ? "Compiled before execution."
                    : "Executed directly by the selected runtime."}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Support</p>
                <p className="mt-2 text-white">{supportedSummary}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-white/12 bg-surface-950/70 p-4">
              <p className="font-medium text-white">
                {activeLanguage === "sflang"
                  ? "Run SFLang code to inspect generated WAT, SSA IR, and JavaScript."
                  : "This panel shows runtime details for interpreted languages and compiler output for SFLang."}
              </p>
              {result?.stderr ? (
                <p className="mt-2 text-xs leading-5 text-rose-200">{result.stderr}</p>
              ) : (
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Switch files or languages from the editor tabs, then run the active file.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompilerExplorer;
