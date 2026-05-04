import { useMemo, useState } from "react";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import Button from "../../components/ui/Button.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import MonacoPanel from "./components/MonacoPanel.jsx";
import ToolShell from "./components/ToolShell.jsx";

const sampleJson = `{
  "project": "SF Tutorial",
  "features": ["tutorials", "practice", "tools"],
  "active": true
}`;

const parseJson = (value) => {
  try {
    const parsed = JSON.parse(value);
    const keys = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? Object.keys(parsed) : [];
    return {
      valid: true,
      message: `Valid JSON${keys.length ? ` with ${keys.length} top-level keys: ${keys.join(", ")}` : "."}`,
    };
  } catch (error) {
    return {
      valid: false,
      message: error instanceof Error ? error.message : "Invalid JSON.",
    };
  }
};

const JsonEditorTool = () => {
  const [value, setValue] = useState(sampleJson);
  const result = useMemo(() => parseJson(value), [value]);

  const handleFormat = () => {
    const parsed = JSON.parse(value);
    setValue(JSON.stringify(parsed, null, 2));
  };

  return (
    <ToolShell
      actions={
        <Button disabled={!result.valid} onClick={handleFormat} variant="gradient">
          Format JSON
        </Button>
      }
      description="Edit payloads in Monaco, format valid JSON, and catch parse errors before using API data."
      title="JSON Editor"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <MonacoPanel language="json" onChange={(nextValue) => setValue(nextValue || "")} value={value} />
        <Card>
          <CardHeader>
            <CardTitle>Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <NoticeBanner title={result.valid ? "Looks good" : "Fix required"} tone={result.valid ? "success" : "error"}>
              {result.message}
            </NoticeBanner>
            <pre className="editor-surface min-h-[13rem] whitespace-pre-wrap">
              {result.valid ? JSON.stringify(JSON.parse(value), null, 2) : "Preview appears after the JSON parses."}
            </pre>
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
};

export default JsonEditorTool;
