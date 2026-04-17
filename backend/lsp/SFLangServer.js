import { compileSource } from "../compiler/pipeline.js";

function getDiagnosticSeverity(name) {
  return name === "SyntaxError" ? 1 : 2; // 1 = Error, 2 = Warning
}

export class SFLangServer {
  constructor() {
    this.documents = new Map();
  }

  handleMessage(ws, message) {
    try {
      const parsed = JSON.parse(message);
      if (parsed.jsonrpc !== "2.0") return;

      const { method, params, id } = parsed;

      switch (method) {
        case "textDocument/didChange":
          this.handleDidChange(ws, params);
          break;
        case "textDocument/completion":
          this.sendResponse(ws, id, this.handleCompletion(params));
          break;
        case "textDocument/hover":
          this.sendResponse(ws, id, this.handleHover(params));
          break;
        case "textDocument/definition":
        case "textDocument/references":
          // Stub for future semantic resolution
          this.sendResponse(ws, id, []);
          break;
        default:
          if (id !== undefined) {
             this.sendResponse(ws, id, null, { code: -32601, message: "Method not found" });
          }
      }
    } catch (err) {
      console.error("LSP Message Error:", err);
    }
  }

  sendResponse(ws, id, result, error = null) {
    const response = { jsonrpc: "2.0", id };
    if (error) {
      response.error = error;
    } else {
      response.result = result;
    }
    ws.send(JSON.stringify(response));
  }

  sendNotification(ws, method, params) {
    ws.send(JSON.stringify({ jsonrpc: "2.0", method, params }));
  }

  handleDidChange(ws, params) {
    const { uri = "default", contentChanges } = params;
    if (contentChanges?.length > 0) {
      const fullText = contentChanges[0].text;
      this.documents.set(uri, fullText);
      this.runDiagnostics(ws, uri, fullText);
    }
  }

  runDiagnostics(ws, uri, text) {
    const diagnostics = [];
    
    try {
      compileSource(text);
    } catch (error) {
      // Very basic rudimentary parse of our custom errors from pipeline.js
      // Example: "Syntax Errors:\\n[Line 1, Col 58] Error: Unexpected primary expression token: '.'"
      const match = error.message.match(/\\[Line (\\d+), Col (\\d+)\\] Error: (.*)/);
      if (match) {
        const line = parseInt(match[1], 10) - 1;
        const col = parseInt(match[2], 10) - 1;
        diagnostics.push({
          range: {
            start: { line, character: col },
            end: { line, character: col + 1 }
          },
          severity: 1, // Error
          source: "sflang",
          message: match[3]
        });
      }
    }

    this.sendNotification(ws, "textDocument/publishDiagnostics", { uri, diagnostics });
  }

  handleCompletion(params) {
    // Return standard snippets/completions for SFLang
    return [
      {
        label: "function",
        kind: 3, // Function
        detail: "Function declaration",
        insertText: "function name() {\\n  \\n}"
      },
      {
        label: "console.log",
        kind: 3, 
        detail: "Log to console",
        insertText: "console.log($1);"
      },
      {
        label: "let",
        kind: 14, // Keyword
        detail: "Variable declaration",
        insertText: "let "
      },
      {
        label: "return",
        kind: 14,
        detail: "Return from function",
        insertText: "return "
      }
    ];
  }

  handleHover(params) {
    // Very rudimentary hover stub based on line presence
    // Ideally maps line/char to AST Node through `compiler/semantic.js` map
    const { position } = params;
    return {
      contents: {
        kind: "markdown",
        value: \`**SFLang Component** at line \${position?.line + 1}\`
      }
    };
  }
}
