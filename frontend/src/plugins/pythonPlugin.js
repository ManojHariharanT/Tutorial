export const pythonPlugin = {
  id: "python",
  displayName: "Python",
  fileExtensions: ["py"],
  grammar: null,
  lspServerUrl: null,
  compilerEndpoint: null,
  executorEndpoint: "/api/playground/run",
  executorStreamEndpoint: "/api/playground/run-stream",
  defaultSnippets: [
    {
      name: "hello world",
      code: "message = 'Hello from Python'\nprint(message)\nprint([value * 2 for value in [1, 2, 3]])",
    },
    {
      name: "function",
      code: "def total_lessons(weeks):\n    return sum(weeks)\n\nprint(total_lessons([4, 6, 8]))",
    },
  ],
};
