import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import LoadingState from "../../components/LoadingState.jsx";
import NoticeBanner from "../../components/NoticeBanner.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import CodeEditor from "../../components/shared/CodeEditor.jsx";
import Console from "../../components/shared/Console.jsx";
import SplitLayout from "../../components/shared/SplitLayout.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import { getMockTutorialById, normalizeTutorial } from "../../config/mockContent.js";
import { getApiErrorMessage } from "../../services/api.js";
import tutorialService from "../../services/tutorialService.js";
import { runSnippetLocally } from "../../utils/codeRunner.js";
import { markDemoTutorialComplete } from "../../utils/demoState.js";

const TutorialDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [tutorial, setTutorial] = useState(location.state?.tutorial || null);
  const [loading, setLoading] = useState(!location.state?.tutorial);
  const [notice, setNotice] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [runError, setRunError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const fallback = getMockTutorialById(id) || location.state?.tutorial || null;
      const remoteId = location.state?.remoteId;

      if (!remoteId) {
        setTutorial(fallback);
        setLoading(false);
        return;
      }

      try {
        const response = await tutorialService.getTutorial(remoteId);

        if (!isMounted) {
          return;
        }

        setTutorial(normalizeTutorial(response));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setTutorial(fallback);
        setNotice(
          `${getApiErrorMessage(error)} Showing the seeded tutorial detail so the lesson remains usable.`,
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
  }, [id, location.state?.remoteId, location.state?.tutorial]);

  useEffect(() => {
    if (!tutorial) {
      return;
    }

    const firstExample = tutorial.languageExamples?.[0];
    setActiveLanguage(firstExample?.language || "JavaScript");
  }, [tutorial]);

  const selectedExample = useMemo(
    () =>
      tutorial?.languageExamples?.find((example) => example.language === activeLanguage) ||
      tutorial?.languageExamples?.[0],
    [activeLanguage, tutorial],
  );

  useEffect(() => {
    if (!tutorial) {
      return;
    }

    setCode(selectedExample?.code || tutorial.challenge?.starterCode || "");
  }, [selectedExample, tutorial]);

  const handleRun = async () => {
    if (!selectedExample) {
      return;
    }

    if (selectedExample.language !== "JavaScript") {
      setOutput("");
      setRunError("The embedded runtime currently executes JavaScript examples only.");
      return;
    }

    setIsRunning(true);
    setRunError("");

    const result = await runSnippetLocally(code);
    setOutput(result.stdout);
    setRunError(result.stderr);
    setIsRunning(false);
  };

  const handleComplete = async () => {
    setIsCompleted(true);

    try {
      if (location.state?.remoteId) {
        await tutorialService.markComplete(location.state.remoteId);
      } else {
        markDemoTutorialComplete(tutorial._id);
      }
    } catch (error) {
      markDemoTutorialComplete(tutorial._id);
      setNotice(
        `${getApiErrorMessage(error)} Completion was stored locally so the tutorial still counts in demo mode.`,
      );
    }
  };

  if (loading) {
    return <LoadingState label="Loading tutorial detail..." />;
  }

  if (!tutorial) {
    return (
      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm text-rose-200">This tutorial could not be found.</p>
          <Link className="text-sm font-semibold text-accent-200" to="/tutorials">
            Back to tutorial library
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <>
            <Badge tone={tutorial.difficulty}>{tutorial.difficulty}</Badge>
            <Badge tone="neutral">{tutorial.duration}</Badge>
            <Button onClick={handleRun} variant="secondary">
              {isRunning ? "Running..." : "Run example"}
            </Button>
            <Button onClick={handleComplete} variant={isCompleted ? "secondary" : "gradient"}>
              {isCompleted ? "Marked complete" : "Mark complete"}
            </Button>
          </>
        }
        description={tutorial.description}
        eyebrow={tutorial.track}
        title={tutorial.title}
      />

      {notice ? (
        <NoticeBanner title="Tutorial is using fallback behavior" tone="warning">
          {notice}
        </NoticeBanner>
      ) : null}

      <SplitLayout
        left={
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-white">Learning objectives</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-400">
                    {tutorial.learningObjectives.map((objective) => (
                      <li key={objective}>- {objective}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Prerequisites</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutorial.prerequisites.map((requirement) => (
                      <Badge key={requirement} tone="neutral">
                        {requirement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {tutorial.sections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <p className="text-sm leading-7 text-slate-400">{section.content}</p>
                  {section.bullets?.length ? (
                    <ul className="space-y-2 text-sm leading-7 text-slate-400">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>- {bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        }
        right={
          <div className="space-y-6">
            <CodeEditor
              activeLanguage={activeLanguage}
              description="Edit the active example or challenge snippet before running it."
              languages={tutorial.languageExamples.map((example) => example.language)}
              onChange={setCode}
              onLanguageChange={setActiveLanguage}
              title="Interactive example"
              value={code}
            />

            <Console
              description={tutorial.challenge?.prompt}
              error={runError}
              output={output}
              status={runError ? "Runtime Error" : output ? "Executed" : "Ready"}
              title={tutorial.challenge?.title || "Output"}
            />
          </div>
        }
      />
    </div>
  );
};

export default TutorialDetail;
