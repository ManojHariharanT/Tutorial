import Console from "../../components/shared/Console.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";

const ResultsPanel = ({ result, error }) => (
  <Card>
    <CardHeader>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>Test results</CardTitle>
        <div className="flex flex-wrap gap-2">
          {result?.status ? <Badge tone={result.status === "Accepted" ? "easy" : "medium"}>{result.status}</Badge> : null}
          {result?.outcome ? <Badge tone={result.outcome === "Success" ? "easy" : "hard"}>{result.outcome}</Badge> : null}
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="soft-panel">
          <p className="text-sm text-slate-400">Passed</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {typeof result?.passed === "number" ? result.passed : "--"}
          </p>
        </div>
        <div className="soft-panel">
          <p className="text-sm text-slate-400">Total</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {typeof result?.total === "number" ? result.total : "--"}
          </p>
        </div>
        <div className="soft-panel">
          <p className="text-sm text-slate-400">Last action</p>
          <p className="mt-2 text-lg font-semibold text-white">{result?.action || "Waiting"}</p>
        </div>
      </div>

      <Console
        error={error || result?.stderr}
        output={result?.stdout}
        status={error ? "Runtime Error" : result?.status || "Ready"}
        title="Execution console"
      />

      {result?.cases?.length ? (
        <div className="space-y-3">
          {result.cases.map((testCase, index) => (
            <div key={`${index}-${JSON.stringify(testCase.input)}`} className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Case {index + 1}</p>
                <Badge tone={testCase.passed ? "easy" : "hard"}>
                  {testCase.passed ? "Passed" : "Failed"}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Input: <span className="font-mono text-slate-200">{JSON.stringify(testCase.input)}</span>
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Expected: <span className="font-mono text-slate-200">{JSON.stringify(testCase.expectedOutput)}</span>
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Actual: <span className="font-mono text-slate-200">{JSON.stringify(testCase.actualOutput)}</span>
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </CardContent>
  </Card>
);

export default ResultsPanel;
