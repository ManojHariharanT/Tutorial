import { useMemo, useState } from "react";
import Tabs, { TabsList, TabsTrigger } from "../../components/ui/Tabs.jsx";
import Card from "../../components/ui/Card.jsx";

const CompilerExplorer = ({ compilation }) => {
  const [activeTab, setActiveTab] = useState("wat");

  if (!compilation) return null;

  const irText = useMemo(() => {
    if (!compilation.ir) return "";
    return compilation.ir.map(block => {
      let text = `Block ${block.id} (${block.name}):\n`;
      block.instructions.forEach(inst => {
        text += `  ${inst.target ? `${inst.target} = ` : ""}${inst.op} ${inst.args ? inst.args.join(", ") : ""}\n`;
      });
      return text;
    }).join("\n");
  }, [compilation.ir]);

  return (
    <Card className="flex flex-col h-full border-surface-800 bg-surface-950/50 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Compiler Explorer</h3>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-surface-900/50">
            <TabsTrigger value="wat" className="text-[10px] uppercase">WASM (WAT)</TabsTrigger>
            <TabsTrigger value="ir" className="text-[10px] uppercase">SSA IR</TabsTrigger>
            <TabsTrigger value="js" className="text-[10px] uppercase">JS Target</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
        {activeTab === "wat" && (
          <pre className="text-cyan-400"><code>{compilation.watCode || "No WASM generated"}</code></pre>
        )}
        {activeTab === "ir" && (
          <pre className="text-purple-400"><code>{irText || "No IR generated"}</code></pre>
        )}
        {activeTab === "js" && (
          <pre className="text-emerald-400"><code>{compilation.jsCode || "No JS generated"}</code></pre>
        )}
      </div>
    </Card>
  );
};

export default CompilerExplorer;
