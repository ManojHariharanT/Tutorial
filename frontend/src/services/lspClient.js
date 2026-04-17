export class LSPClient {
  constructor(language, uri, serverUrl) {
    this.language = language;
    this.uri = uri;
    this.serverUrl = serverUrl;
    this.ws = null;
    this.requests = new Map();
    this.nextMessageId = 1;
    this.onDiagnostics = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      let wsUrl = this.serverUrl;
      
      // Fallback if registry did not strictly bind the url
      if (!wsUrl) {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = process.env.NODE_ENV === "production" ? window.location.host : "localhost:5000";
        wsUrl = `${protocol}//${host}/lsp/${this.language}`;
      }

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        resolve();
      };

      this.ws.onerror = (error) => {
        reject(error);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onclose = () => {
        console.log("LSP Disconnected");
      };
    });
  }

  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      if (message.id !== undefined && this.requests.has(message.id)) {
        const { resolve, reject } = this.requests.get(message.id);
        this.requests.delete(message.id);
        
        if (message.error) {
          reject(message.error);
        } else {
          resolve(message.result);
        }
      } else if (message.method === "textDocument/publishDiagnostics") {
        if (this.onDiagnostics) {
          this.onDiagnostics(message.params.diagnostics);
        }
      }
    } catch (e) {
      console.error("LSP Client Message Error:", e);
    }
  }

  sendRequest(method, params = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("LSP Connection is not open"));
    }

    return new Promise((resolve, reject) => {
      const id = this.nextMessageId++;
      this.requests.set(id, { resolve, reject });

      this.ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id,
        method,
        params
      }));
    });
  }

  sendNotification(method, params = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        jsonrpc: "2.0",
        method,
        params
      }));
    }
  }

  notifyChange(text) {
    this.sendNotification("textDocument/didChange", {
      uri: this.uri,
      version: 1, // simplified
      contentChanges: [{ text }]
    });
  }

  getCompletions(position) {
    return this.sendRequest("textDocument/completion", {
      textDocument: { uri: this.uri },
      position
    });
  }

  getHover(position) {
    return this.sendRequest("textDocument/hover", {
      textDocument: { uri: this.uri },
      position
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
