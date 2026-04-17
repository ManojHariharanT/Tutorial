const formatValue = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "undefined") {
    return "undefined";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch (_error) {
    return String(value);
  }
};

const createConsoleCapture = () => {
  const logs = [];

  const push = (...values) => {
    logs.push(values.map((value) => formatValue(value)).join(" "));
  };

  return {
    logs,
    consoleProxy: {
      log: (...values) => push(...values),
      error: (...values) => push(...values),
      warn: (...values) => push(...values),
      info: (...values) => push(...values),
      table: (...values) => push(...values),
    },
  };
};

const compareOutputs = (actual, expected) => formatValue(actual) === formatValue(expected);

export const runSnippetLocally = async (code) => {
  if (!code?.trim()) {
    return {
      success: false,
      stdout: "",
      stderr: "Code is required before running the snippet.",
    };
  }

  const { logs, consoleProxy } = createConsoleCapture();

  try {
    const executor = new Function("console", `"use strict";\n${code}`);
    const result = executor(consoleProxy);

    if (typeof result !== "undefined") {
      logs.push(formatValue(result));
    }

    return {
      success: true,
      stdout: logs.join("\n"),
      stderr: "",
    };
  } catch (error) {
    return {
      success: false,
      stdout: logs.join("\n"),
      stderr: error instanceof Error ? error.message : "Unable to run this snippet locally.",
    };
  }
};

export const runWorkspaceLocally = async (files, activeFileId) => {
  const activeFile = files.find((file) => file.id === activeFileId);
  const executableFiles = files.filter((file) => file.language === "javascript");

  if (!activeFile || activeFile.language !== "javascript") {
    return {
      success: false,
      stdout: "",
      stderr: "Only JavaScript files can be executed in the local playground runtime.",
    };
  }

  const orderedFiles = [
    ...executableFiles.filter((file) => file.id !== activeFileId),
    activeFile,
  ];

  const code = orderedFiles
    .map((file) =>
      `// ${file.path}\n${file.content
        .replace(/^import\s.+$/gm, "")
        .replace(/^export\s+default\s+/gm, "")
        .replace(/^export\s+/gm, "")}`,
    )
    .join("\n\n");

  return runSnippetLocally(code);
};

export const evaluateProblemLocally = async ({ code, functionName, testCases }) => {
  if (!code?.trim()) {
    return {
      passed: 0,
      total: testCases.length,
      status: "Runtime Error",
      outcome: "Failed",
      stdout: "",
      stderr: "Code is required before evaluating this problem.",
      cases: [],
    };
  }

  const { logs, consoleProxy } = createConsoleCapture();

  try {
    const factory = new Function(
      "console",
      `"use strict";\n${code}\nreturn typeof ${functionName} === "function" ? ${functionName} : null;`,
    );
    const candidate = factory(consoleProxy);

    if (typeof candidate !== "function") {
      throw new Error(`Expected a function named "${functionName}".`);
    }

    const caseResults = testCases.map((testCase) => {
      const actualOutput = candidate(...testCase.input);

      return {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        passed: compareOutputs(actualOutput, testCase.expectedOutput),
      };
    });

    const passed = caseResults.filter((entry) => entry.passed).length;
    const total = caseResults.length;

    return {
      passed,
      total,
      status: passed === total ? "Accepted" : "Try Again",
      outcome: passed === total ? "Success" : "Failed",
      stdout: logs.join("\n"),
      stderr: "",
      success: true,
      cases: caseResults,
    };
  } catch (error) {
    return {
      passed: 0,
      total: testCases.length,
      status: "Runtime Error",
      outcome: "Failed",
      stdout: logs.join("\n"),
      stderr: error instanceof Error ? error.message : "Unable to evaluate this problem locally.",
      success: false,
      cases: [],
    };
  }
};
