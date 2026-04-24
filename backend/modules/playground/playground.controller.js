import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  executePlaygroundCode,
  listPlaygroundLanguages,
  streamPlaygroundCodeExecution,
} from "./playground.service.js";

export const getPlaygroundLanguages = asyncHandler(async (_req, res) => {
  const languages = await listPlaygroundLanguages();
  res.json({ languages });
});

export const runPlaygroundCode = asyncHandler(async (req, res) => {
  const result = await executePlaygroundCode({
    code: req.body.code,
    language: req.body.language,
    userId: req.user?._id,
  });

  res.json(result);
});

export const streamPlaygroundCode = asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });

  await streamPlaygroundCodeExecution({
    code,
    language,
    userId: req.user?._id,
    onStdout: (data) => res.write(`data: ${JSON.stringify({ type: "stdout", payload: data })}\n\n`),
    onStderr: (data) => res.write(`data: ${JSON.stringify({ type: "stderr", payload: data })}\n\n`),
    onEnd: (result) => {
      res.write(`data: ${JSON.stringify({ type: "end", payload: result })}\n\n`);
      res.end();
    }
  });
});
