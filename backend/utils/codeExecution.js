import { execFile } from "node:child_process";
import { access, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { AppError } from "./AppError.js";
import { runInDocker, runInDockerStream } from "../sandbox/dockerExecutor.js";

const execFileAsync = promisify(execFile);
const RESULT_MARKER = "__SF_RESULT__";
const MAX_BUFFER_SIZE = 1024 * 1024;
const DEFAULT_TIMEOUT = 5000;
const runtimeCache = new Map();

const normalizeLanguage = (language = "javascript") => language.toLowerCase().trim();

const buildTempFilePath = (extension) =>
  path.join(tmpdir(), `sf-tutorial-${Date.now()}-${randomUUID()}.${extension}`);

const LANGUAGE_CONFIGS = {
  javascript: {
    id: "javascript",
    displayName: "JavaScript",
    extension: "mjs",
    executionType: "interpreted",
    runtimeCandidates: [process.execPath],
    buildCommand: (runtimeCommand, sourcePath) => ({
      command: runtimeCommand,
      args: [sourcePath],
    }),
  },
  python: {
    id: "python",
    displayName: "Python",
    extension: "py",
    executionType: "interpreted",
    runtimeCandidates: ["python", "python3"],
    buildCommand: (runtimeCommand, sourcePath) => ({
      command: runtimeCommand,
      args: [sourcePath],
    }),
  },
  sflang: {
    id: "sflang",
    displayName: "SFLang",
    extension: "sf",
    executionType: "compiled",
    runtimeCandidates: [process.execPath],
    buildCommand: (runtimeCommand, sourcePath) => ({
      command: runtimeCommand,
      args: [sourcePath],
    }),
  },
};

const resolveRuntimeCandidate = async (candidate) => {
  if (path.isAbsolute(candidate)) {
    try {
      await access(candidate);
      return candidate;
    } catch (_error) {
      return null;
    }
  }

  if (runtimeCache.has(candidate)) {
    return runtimeCache.get(candidate);
  }

  const pathEntries = (process.env.PATH || "")
    .split(path.delimiter)
    .map((entry) => entry.trim())
    .filter(Boolean);
  const hasExtension = Boolean(path.extname(candidate));
  const extensions =
    process.platform === "win32"
      ? hasExtension
        ? [""]
        : (process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM")
            .split(";")
            .filter(Boolean)
      : [""];

  for (const directory of pathEntries) {
    for (const extension of extensions) {
      const resolvedPath = path.join(directory, `${candidate}${extension}`);

      try {
        await access(resolvedPath);
        runtimeCache.set(candidate, resolvedPath);
        return resolvedPath;
      } catch (_error) {
        // Keep scanning PATH entries until we find a matching executable.
      }
    }
  }

  runtimeCache.set(candidate, null);
  return null;
};

const getLanguageRuntime = async (language = "javascript") => {
  const normLang = normalizeLanguage(language);
  const config = LANGUAGE_CONFIGS[normLang];

  if (!config) {
    throw new AppError(
      `Unsupported language "${language}". Supported languages: ${Object.values(LANGUAGE_CONFIGS)
        .map((entry) => entry.displayName)
        .join(", ")}.`,
      400,
    );
  }

  for (const candidate of config.runtimeCandidates) {
    const resolvedCommand = await resolveRuntimeCandidate(candidate);

    if (resolvedCommand) {
      return {
        ...config,
        resolvedCommand,
      };
    }
  }

  throw new AppError(`${config.displayName} runtime is not available on this server.`, 503);
};

const executeRuntime = async ({ code, runtime, timeoutMs = DEFAULT_TIMEOUT }) => {
  const tempFile = buildTempFilePath(runtime.extension);

  try {
    await writeFile(tempFile, code, "utf8");
    const { command, args } = runtime.buildCommand(runtime.resolvedCommand, tempFile);
    const { stdout, stderr } = await execFileAsync(command, args, {
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

const toRuntimeMetadata = (runtime) => ({
  id: runtime.id,
  displayName: runtime.displayName,
  executionType: runtime.executionType,
  command: runtime.resolvedCommand,
});

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
  const runtime = await getLanguageRuntime(language);
  let codeToRun = code;
  let runtimeForExecution = runtime;
  let compilationArtifacts;

  if (runtime.id === "sflang") {
    try {
      const { compileSource } = await import("../compiler/pipeline.js");
      const result = compileSource(code);
      const javascriptRuntime = await getLanguageRuntime("javascript");
      codeToRun = result.jsCode;
      runtimeForExecution = javascriptRuntime;
      compilationArtifacts = {
        tokens: result.tokens,
        ir: result.ir,
        jsCode: result.jsCode,
        watCode: result.watCode,
      };
    } catch (err) {
      return {
        success: false,
        stdout: "",
        stderr: err.message,
        language: runtime.id,
        runtime: toRuntimeMetadata(runtime),
      };
    }
  }

  let executionResult;
  if (process.env.USE_DOCKER_SANDBOX === "true") {
    executionResult = await runInDocker({
      code: codeToRun,
      language: runtimeForExecution.id,
      timeoutMs,
    });
  } else {
    executionResult = await executeRuntime({
      code: codeToRun,
      runtime: runtimeForExecution,
      timeoutMs,
    });
  }

  return {
    ...executionResult,
    language: runtime.id,
    runtime: toRuntimeMetadata(runtimeForExecution),
    compilation: compilationArtifacts,
  };
};


export const streamCodeSnippet = async ({ code, language = "javascript", timeoutMs = DEFAULT_TIMEOUT, onStdout, onStderr }) => {
  const runtime = await getLanguageRuntime(language);
  let codeToRun = code;
  let runtimeForExecution = runtime;

  if (runtime.id === "sflang") {
    try {
      const { compileSource } = await import("../compiler/pipeline.js");
      const result = compileSource(code);
      const javascriptRuntime = await getLanguageRuntime("javascript");
      codeToRun = result.jsCode;
      runtimeForExecution = javascriptRuntime;
    } catch (err) {
      onStderr(err.message);
      return { success: false, stdout: "", stderr: err.message };
    }
  }

  if (process.env.USE_DOCKER_SANDBOX === "true") {
    return new Promise((resolve) => {
      let combinedStdout = "";
      let combinedStderr = "";

      runInDockerStream({
        code: codeToRun,
        language: runtimeForExecution.id,
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

  const result = await runCodeSnippet({ code, language, timeoutMs });
  if (result.stdout) onStdout && onStdout(result.stdout);
  if (result.stderr) onStderr && onStderr(result.stderr);
  return result;
};

export const getSupportedPlaygroundLanguages = async () => {
  const entries = await Promise.all(
    Object.keys(LANGUAGE_CONFIGS).map(async (languageId) => {
      try {
        const runtime = await getLanguageRuntime(languageId);
        return {
          id: runtime.id,
          displayName: runtime.displayName,
          executionType: runtime.executionType,
          command: runtime.resolvedCommand,
        };
      } catch (_error) {
        return null;
      }
    }),
  );

  return entries.filter(Boolean);
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
