export const sfLangPlugin = {
  id: "sflang",
  displayName: "SF Lang (Custom)",
  fileExtensions: ["sf", "sflang"],
  grammar: {
    // Monaco Grammar Rules stub
    keywords: ["let", "const", "var", "function", "return", "if", "else", "while", "for", "true", "false", "null"],
    operators: ["=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=", "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^", "%", "<<", ">>", ">>>", "+=", "-=", "*=", "/=", "&=", "|=", "^=", "%=", "<<=", ">>=", ">>>="],
  },
  lspServerUrl: typeof window !== "undefined" && window.location.protocol === "https:"
    ? `wss://${window.location.host}/lsp/sflang`
    : "ws://localhost:5000/lsp/sflang",
  compilerEndpoint: "/api/playground/compile",
  executorEndpoint: "/api/playground/run",
  executorStreamEndpoint: "/api/playground/run-stream",
  defaultSnippets: [
    {
      name: "console.log",
      code: "console.log('Hello from SFLang');",
    },
    {
      name: "function block",
      code: "function mySFLangFunc() {\n  return true;\n}",
    }
  ]
};
