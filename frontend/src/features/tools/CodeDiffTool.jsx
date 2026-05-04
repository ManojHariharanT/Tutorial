import { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import ToolShell from "./components/ToolShell.jsx";

const originalSample = `function total(values) {
  return values.reduce((sum, value) => sum + value, 0);
}`;

const modifiedSample = `function total(values) {
  return values
    .filter((value) => Number.isFinite(value))
    .reduce((sum, value) => sum + value, 0);
}`;

const CodeDiffTool = () => {
  const [original, setOriginal] = useState(originalSample);
  const [modified, setModified] = useState(modifiedSample);

  return (
    <ToolShell
      description="Paste two versions of code and inspect line-by-line changes with Monaco's diff editor."
      title="Code Diff"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Original</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <textarea
              className="editor-surface min-h-[14rem]"
              onChange={(event) => setOriginal(event.target.value)}
              spellCheck={false}
              value={original}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Modified</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <textarea
              className="editor-surface min-h-[14rem]"
              onChange={(event) => setModified(event.target.value)}
              spellCheck={false}
              value={modified}
            />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Diff</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
            <DiffEditor
              height="34rem"
              language="javascript"
              modified={modified}
              original={original}
              theme="vs"
              options={{
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: false },
                renderSideBySide: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </ToolShell>
  );
};

export default CodeDiffTool;
