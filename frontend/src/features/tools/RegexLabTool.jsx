import { useMemo, useState } from "react";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import ToolShell from "./components/ToolShell.jsx";

const sampleText = `john@example.com
admin@sf-tutorial.dev
not-an-email
support@learning.tools`;

const RegexLabTool = () => {
  const [pattern, setPattern] = useState("[\\w.-]+@[\\w.-]+\\.\\w+");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState(sampleText);

  const result = useMemo(() => {
    try {
      const normalizedFlags = flags.includes("g") ? flags : `${flags}g`;
      const regex = new RegExp(pattern, normalizedFlags);
      const matches = [];
      let match = regex.exec(text);

      while (match) {
        matches.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1),
        });

        if (match[0] === "") {
          regex.lastIndex += 1;
        }

        match = regex.exec(text);
      }

      return { error: "", matches };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid regular expression.", matches: [] };
    }
  }, [flags, pattern, text]);

  return (
    <ToolShell
      description="Build a regular expression, test it against sample input, and inspect match positions and capture groups."
      title="Regex Lab"
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pattern</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Input label="Regex pattern" onChange={(event) => setPattern(event.target.value)} value={pattern} />
            <Input label="Flags" onChange={(event) => setFlags(event.target.value)} value={flags} />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Test string</span>
              <textarea
                className="editor-surface min-h-[20rem]"
                onChange={(event) => setText(event.target.value)}
                spellCheck={false}
                value={text}
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {result.error ? (
              <NoticeBanner title="Pattern error" tone="error">{result.error}</NoticeBanner>
            ) : (
              <NoticeBanner title={`${result.matches.length} matches`} tone="success">
                Results update as you type.
              </NoticeBanner>
            )}
            <div className="space-y-3">
              {result.matches.length ? (
                result.matches.map((match, index) => (
                  <div className="soft-panel" key={`${match.index}-${index}`}>
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-slate-100">{match.value}</strong>
                      <span className="text-sm text-slate-400">Index {match.index}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {match.groups.length ? `Groups: ${match.groups.join(", ")}` : "No capture groups"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                  No matches yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
};

export default RegexLabTool;
