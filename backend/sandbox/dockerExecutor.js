import { spawn } from "node:child_process";
import { AppError } from "../utils/AppError.js";

const DEFAULT_TIMEOUT = 5000; // 5 seconds
const MEMORY_LIMIT = "128m";
const CPU_QUOTA = 50000; // 50% CPU

// Map languages to predefined stable images.
// In production, you would pre-build custom `sandbox-python:latest` images.
const IMAGE_MAP = {
  javascript: "node:alpine",
  sflang: "node:alpine", // Transpiled to JS
  python: "python:3.11-alpine",
};

// Map languages to their execution command using stdin
const COMMAND_MAP = {
  javascript: ["node"],
  sflang: ["node"],
  python: ["python", "-c", "import sys; exec(sys.stdin.read())"],
};

export const runInDockerStream = ({ code, language, timeoutMs = DEFAULT_TIMEOUT, onStdout, onStderr, onExit }) => {
  const normLang = language.toLowerCase().trim();
  const image = IMAGE_MAP[normLang];
  const executeCmd = COMMAND_MAP[normLang];

  if (!image || !executeCmd) {
    throw new AppError(`Execution sandbox for language '${language}' is not implemented.`, 400);
  }

  const dockerArgs = [
    "run",
    "-i",
    "--rm",
    "--network=none",
    `--memory=${MEMORY_LIMIT}`,
    `--cpu-quota=${CPU_QUOTA}`,
    "--read-only",
  ];

  if (process.env.USE_GVISOR === "true") {
    dockerArgs.push("--runtime=runsc");
  }

  dockerArgs.push(image);
  dockerArgs.push(...executeCmd);

  const child = spawn("docker", dockerArgs);

  child.stdout.on("data", (data) => {
    onStdout(data.toString());
  });

  child.stderr.on("data", (data) => {
    onStderr(data.toString());
  });

  const timeoutPath = setTimeout(() => {
    child.kill("SIGKILL");
    onStderr("\\n[Timeout: Process exceeded 5000ms]\\n");
    onExit({ code: 1, success: false });
  }, timeoutMs);

  child.on("close", (code) => {
    clearTimeout(timeoutPath);
    onExit({ code, success: code === 0 });
  });

  child.stdin.write(code);
  child.stdin.end();
  
  return child;
};

export const runInDocker = async ({ code, language, timeoutMs = DEFAULT_TIMEOUT }) => {
  return new Promise((resolve) => {
    let combinedStdout = "";
    let combinedStderr = "";

    runInDockerStream({
      code,
      language,
      timeoutMs,
      onStdout: (data) => { combinedStdout += data; },
      onStderr: (data) => { combinedStderr += data; },
      onExit: ({ code, success }) => {
        resolve({
          success,
          stdout: combinedStdout.trim(),
          stderr: combinedStderr.trim(),
        });
      }
    });
  });
};
