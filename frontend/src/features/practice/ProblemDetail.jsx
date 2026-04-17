import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import CodeEditor from "../../components/shared/CodeEditor.jsx";
import SplitLayout from "../../components/shared/SplitLayout.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import { getMockProblemById, normalizeProblemDetail } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import practiceService from "../../services/practiceService.js";
import { evaluateProblemLocally } from "../../utils/codeRunner.js";
import { recordDemoSubmission } from "../../utils/demoState.js";
import ResultsPanel from "./ResultsPanel.jsx";

const ProblemDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [problem, setProblem] = useState(location.state?.problem || null);
  const [loading, setLoading] = useState(!location.state?.problem);
  const [notice, setNotice] = useState("");
  const [code, setCode] = useState(location.state?.problem?.starterCode || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const fallback = getMockProblemById(id) || location.state?.problem || null;
      const remoteId = location.state?.remoteId;

      if (!remoteId) {
        setProblem(fallback);
        setCode(fallback?.starterCode || "");
        setLoading(false);
        return;
      }

      try {
        const response = await practiceService.getProblem(remoteId);

        if (!isMounted) {
          return;
        }

        const normalized = normalizeProblemDetail(response);
        setProblem(normalized);
        setCode(normalized.starterCode);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setProblem(fallback);
        setCode(fallback?.starterCode || "");
        setNotice(
          `${getApiErrorMessage(loadError)} The local evaluator is active so you can still solve the problem.`,
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [id, location.state?.problem, location.state?.remoteId]);

  const handleRun = async () => {
    if (!problem) {
      return;
    }

    setIsRunning(true);
    setError("");

    try {
      if (location.state?.remoteId) {
        const response = await practiceService.runCode(location.state.remoteId, {
          code,
          language: "javascript",
        });

        setResult({ ...response, action: "Run samples" });
        return;
      }

      const response = await evaluateProblemLocally({
        code,
        functionName: problem.functionName,
        testCases: problem.testCases.filter((testCase) => testCase.isSample),
      });

      setResult({ ...response, action: "Run samples" });
    } catch (runError) {
      const fallback = await evaluateProblemLocally({
        code,
        functionName: problem.functionName,
        testCases: problem.testCases.filter((testCase) => testCase.isSample),
      });

      setNotice(
        `${getApiErrorMessage(runError)} Sample evaluation switched to the local runtime.`,
      );
      setResult({ ...fallback, action: "Run samples" });
      setError(fallback.stderr);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (location.state?.remoteId) {
        const response = await practiceService.submitCode({
          problemId: location.state.remoteId,
          code,
          language: "javascript",
        });

        setResult({ ...response, action: "Submit solution" });
        recordDemoSubmission({
          problemId: problem._id,
          status: response.status,
          passed: response.passed,
          total: response.total,
        });
        return;
      }

      const response = await evaluateProblemLocally({
        code,
        functionName: problem.functionName,
        testCases: problem.testCases,
      });

      recordDemoSubmission({
        problemId: problem._id,
        status: response.status,
        passed: response.passed,
        total: response.total,
      });
      setResult({ ...response, action: "Submit solution" });
    } catch (submitError) {
      const fallback = await evaluateProblemLocally({
        code,
        functionName: problem.functionName,
        testCases: problem.testCases,
      });

      recordDemoSubmission({
        problemId: problem._id,
        status: fallback.status,
        passed: fallback.passed,
        total: fallback.total,
      });
      setNotice(
        `${getApiErrorMessage(submitError)} Submission fell back to the local evaluator and local progress tracking.`,
      );
      setResult({ ...fallback, action: "Submit solution" });
      setError(fallback.stderr);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading problem details..." />;
  }

  if (!problem) {
    return (
      <Card>
        <CardContent className="text-sm text-rose-200">
          This practice problem could not be found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Badge tone={problem.difficulty}>{problem.difficulty}</Badge>
            <Button disabled={isRunning || isSubmitting} onClick={handleRun} variant="secondary">
              {isRunning ? "Running..." : "Run samples"}
            </Button>
            <Button disabled={isRunning || isSubmitting} onClick={handleSubmit} variant="gradient">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </>
        }
        description={problem.description}
        eyebrow={problem.category}
        title={problem.title}
      />

      {notice ? (
        <NoticeBanner title="Practice runtime notice" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      <SplitLayout
        bottom={<ResultsPanel error={error} result={result} />}
        left={
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Problem briefing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} tone="tag">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  {problem.examples.map((example, index) => (
                    <div key={`${example.input}-${index}`} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                      <p className="text-sm font-semibold text-white">Example {index + 1}</p>
                      <p className="mt-3 text-sm text-slate-400">
                        Input: <span className="font-mono text-slate-200">{example.input}</span>
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Output: <span className="font-mono text-slate-200">{example.output}</span>
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{example.explanation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Constraints and hints</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2 pt-4">
                <div>
                  <p className="text-sm font-semibold text-white">Constraints</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-400">
                    {problem.constraints.map((constraint) => (
                      <li key={constraint}>- {constraint}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Hints</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-400">
                    {problem.hints.map((hint) => (
                      <li key={hint}>- {hint}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        }
        right={
          <CodeEditor
            description={`Implement ${problem.functionName} in JavaScript.`}
            onChange={setCode}
            title="Solution editor"
            value={code}
          />
        }
      />
    </div>
  );
};

export default ProblemDetail;
