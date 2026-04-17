import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import { mockTools } from "../../config/mockContent.js";
import { recordDemoToolUsage } from "../../utils/demoState.js";

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

const ToolsGrid = () => {
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
    <div className="space-y-8">
      <PageHeader
        description="Utility cards expose small developer workflows directly in the learning platform so formatting and validation stay nearby."
        eyebrow="Developer Tools"
        title="Formatter and validator workspace"
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {mockTools.map((tool) => (
          <button key={tool.id} onClick={() => handleSelectTool(tool)} type="button">
            <Card
              className={`h-full text-left transition duration-200 hover:-translate-y-1 ${
                activeTool.id === tool.id ? "border-accent-400/25 bg-accent-400/10" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={tool.accent}>{tool.category}</Badge>
                </div>
                <CardTitle className="mt-3">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm leading-7 text-slate-400">{tool.description}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {error ? (
        <NoticeBanner title="Tool execution failed" tone="error">
          {error}
        </NoticeBanner>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>{activeTool.name}</CardTitle>
              {activeTool.id === "base64-encoder" ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setBase64Mode("encode")}
                    size="sm"
                    variant={base64Mode === "encode" ? "primary" : "secondary"}
                  >
                    Encode
                  </Button>
                  <Button
                    onClick={() => setBase64Mode("decode")}
                    size="sm"
                    variant={base64Mode === "decode" ? "primary" : "secondary"}
                  >
                    Decode
                  </Button>
                </div>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <textarea
              className="editor-surface min-h-[22rem]"
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
              value={input}
            />
            <Button onClick={handleRunTool} variant="gradient">
              Run tool
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <pre className="editor-surface min-h-[22rem] whitespace-pre-wrap">{output || "Run a tool to see the result."}</pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToolsGrid;
