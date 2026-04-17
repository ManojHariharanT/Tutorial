import { execFile } from "node:child_process";
import { unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { AppError } from "./AppError.js";
import { runInDocker } from "../sandbox/dockerExecutor.js";

const require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);
const RESULT_MARKER = "__SF_RESULT__";
const MAX_BUFFER_SIZE = 1024 * 1024;
const DEFAULT_TIMEOUT = 5000;

const getTempFilePath = () =>
  path.join(tmpdir(), `sf-tutorial-${Date.now()}-${randomUUID()}.mjs`);

const normalizeLanguage = (language = "javascript") => language.toLowerCase().trim();

const parseExecutionError = (error) => {
  if (error.killed || error.signal === "SIGTERM" || error.code === "ETIMEDOUT") {
    throw new AppError("Execution timed out after 5 seconds.", 408);
  }

  return {
    stdout: error.stdout || "",
    stderr: error.stderr || error.message,
    success: false,
  };
};

export const runCodeSnippet = async ({ code, language = "javascript", timeoutMs = DEFAULT_TIMEOUT }) => {
  const normLang = normalizeLanguage(language);
  let jsCodeToRun = code;

  if (normLang === "sflang") {
    try {
      const { compileSource } = await import("../compiler/pipeline.js");
      const result = compileSource(code);
      jsCodeToRun = result.jsCode;
    } catch (err) {
      return { success: false, stdout: "", stderr: err.message };
    }
  } else if (normLang !== "javascript") {
    throw new AppError("Only JavaScript and sflang execution is available right now.", 400);
  }

  // Check if we want to run in dockerd mode or fallback to child_process
  if (process.env.USE_DOCKER_SANDBOX === "true") {
    return runInDocker({ code: jsCodeToRun, language: normLang, timeoutMs });
  }

  const tempFile = getTempFilePath();

  try {
    await writeFile(tempFile, jsCodeToRun, "utf8");

    const { stdout, stderr } = await execFileAsync(process.execPath, [tempFile], {
      timeout: timeoutMs,
      windowsHide: true,
      maxBuffer: MAX_BUFFER_SIZE,
    });

    return {
      stdout: stdout?.trim() || "",
      stderr: stderr?.trim() || "",
      success: !stderr,
    };
  } catch (error) {
    return parseExecutionError(error);
  } finally {
    await unlink(tempFile).catch(() => {});
  }
};

export const streamCodeSnippet = async ({ code, language = "javascript", timeoutMs = DEFAULT_TIMEOUT, onStdout, onStderr }) => {
  const normLang = normalizeLanguage(language);
  let jsCodeToRun = code;

  if (normLang === "sflang") {
    try {
      const { compileSource } = await import("../compiler/pipeline.js");
      const result = compileSource(code);
      jsCodeToRun = result.jsCode;
    } catch (err) {
      onStderr(err.message);
      return { success: false, stdout: "", stderr: err.message };
    }
  } else if (normLang !== "javascript") {
    throw new AppError("Only JavaScript and sflang execution is available right now.", 400);
  }

  if (process.env.USE_DOCKER_SANDBOX === "true" || process.env.USE_DOCKER_SANDBOX !== "false") {
    // We default to Docker streaming unless they strictly opt out
    return new Promise((resolve) => {
      let combinedStdout = "";
      let combinedStderr = "";
      const { runInDockerStream } = require("../sandbox/dockerExecutor.js");

      runInDockerStream({
        code: jsCodeToRun,
        language: normLang,
        timeoutMs,
        onStdout: (data) => {
          combinedStdout += data;
          onStdout && onStdout(data);
        },
        onStderr: (data) => {
          combinedStderr += data;
          onStderr && onStderr(data);
        },
        onExit: ({ code, success }) => {
          resolve({
            stdout: combinedStdout.trim(),
            stderr: combinedStderr.trim(),
            success
          });
        }
      });
    });
  }

  // Fallback to synchronous run and emit once
  const result = await runCodeSnippet({ code, language, timeoutMs });
  if (result.stdout) onStdout && onStdout(result.stdout);
  if (result.stderr) onStderr && onStderr(result.stderr);
  return result;
};

export const evaluateFunctionSolution = async ({ code, functionName, testCases, timeoutMs = DEFAULT_TIMEOUT }) => {
  const safeFunctionName = functionName.trim();
  const payload = JSON.stringify(testCases);
  const wrappedCode = `
${code}

const __sfFunction = typeof ${safeFunctionName} === "function" ? ${safeFunctionName} : undefined;

if (typeof __sfFunction !== "function") {
  throw new Error("Expected a function named ${safeFunctionName}.");
}

const __sfCases = ${payload};

(async () => {
  const __sfResults = [];

  for (const __sfCase of __sfCases) {
    const __sfValue = await Promise.resolve(__sfFunction(...__sfCase.input));
    __sfResults.push(__sfValue);
  }

  console.log("${RESULT_MARKER}" + JSON.stringify(__sfResults));
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
`;

  const execution = await runCodeSnippet({
    code: wrappedCode,
    language: "javascript",
    timeoutMs,
  });

  const resultIndex = execution.stdout.lastIndexOf(RESULT_MARKER);

  if (resultIndex === -1) {
    return {
      ...execution,
      results: [],
    };
  }

  const resultPayload = execution.stdout.slice(resultIndex + RESULT_MARKER.length);
  const cleanStdout = execution.stdout.slice(0, resultIndex).trim();

  try {
    return {
      ...execution,
      stdout: cleanStdout,
      results: JSON.parse(resultPayload),
    };
  } catch (_error) {
    return {
      ...execution,
      stdout: cleanStdout,
      results: [],
      stderr: execution.stderr || "Could not parse the evaluation output.",
      success: false,
    };
  }
};

export const compareOutputs = (actual, expected) =>
  JSON.stringify(actual) === JSON.stringify(expected);
