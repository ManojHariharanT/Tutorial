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
      this.documents.set(uri, {
        text: fullText,
        analysis: null
      });
      this.runDiagnostics(ws, uri, fullText);
    }
  }

  runDiagnostics(ws, uri, text) {
    const diagnostics = [];
    
    try {
      const result = compileSource(text);
      const doc = this.documents.get(uri);
      if (doc) doc.analysis = result;
    } catch (error) {
       const match = error.message.match(/\[Line (\d+), Col (\d+)\] (?:Semantic Error|Syntax Error): (.*)/);
       if (match) {
        const line = parseInt(match[1], 10) - 1;
        const col = parseInt(match[2], 10) - 1;
        diagnostics.push({
          range: {
            start: { line, character: col },
            end: { line, character: col + 1 }
          },
          severity: 1,
          source: "sflang",
          message: match[3]
        });
      }
    }

    this.sendNotification(ws, "textDocument/publishDiagnostics", { uri, diagnostics });
  }

  handleCompletion(params) {
    return [
      { label: "function", kind: 3, detail: "Function declaration", insertText: "function name() {\n  \n}" },
      { label: "console.log", kind: 3, detail: "Log to console", insertText: "console.log($1);" },
      { label: "let", kind: 14, detail: "Variable declaration", insertText: "let " },
      { label: "return", kind: 14, detail: "Return from function", insertText: "return " }
    ];
  }

  handleHover(params) {
    const { textDocument, position } = params;
    const doc = this.documents.get(textDocument.uri);
    if (!doc || !doc.analysis) return null;

    const symbol = doc.analysis.analyzer.findSymbolAt(position.line + 1, position.character + 1);
    if (!symbol) return null;

    let markdown = `**${symbol.name}** (${symbol.info.kind})`;
    if (symbol.info.kind === "function") {
      markdown += `\n\nParameters: \`${symbol.info.params.join(", ")}\``;
    } else if (symbol.info.kind === "built_in") {
      markdown = `**${symbol.name}** (Built-in)`;
    }

    return {
      contents: {
        kind: "markdown",
        value: markdown
      }
    };
  }

  handleDefinition(params) {
    const { textDocument, position } = params;
    const doc = this.documents.get(textDocument.uri);
    if (!doc || !doc.analysis) return [];

    const symbol = doc.analysis.analyzer.findSymbolAt(position.line + 1, position.character + 1);
    if (!symbol) return [];

    return [{
      uri: textDocument.uri,
      range: {
        start: { line: symbol.line - 1, character: symbol.col - 1 },
        end: { line: symbol.line - 1, character: symbol.col - 1 + symbol.name.length }
      }
    }];
  }
}

