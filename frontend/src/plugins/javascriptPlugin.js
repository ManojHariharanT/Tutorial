export const javascriptPlugin = {
  id: "javascript",
  displayName: "JavaScript",
  fileExtensions: ["js", "jsx", "ts", "tsx"],
  grammar: null, // Monaco handles JS out of the box natively
  lspServerUrl: null, // Uses Monaco's internal typescript/js language worker
  compilerEndpoint: null,
  executorEndpoint: "/api/playground/run",
  executorStreamEndpoint: "/api/playground/run-stream",
  defaultSnippets: [
    {
      name: "console.log",
      code: "console.log('Hello World');",
    },
    {
      name: "arrow function",
      code: "const main = async () => {\\n  // JS Execution runs natively\\n};\\nmain();",
    }
  ]
};
