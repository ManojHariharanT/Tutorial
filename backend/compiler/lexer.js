import { Token, TokenType } from "./token.js";

const KEYWORDS = new Set([
  "let", "const", "var",
  "if", "else", "while", "for",
  "function", "return", "true", "false", "null"
]);

export class Lexer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
  }

  isAtEnd() {
    return this.pos >= this.source.length;
  }

  peek(offset = 0) {
    if (this.pos + offset >= this.source.length) return "\0";
    return this.source[this.pos + offset];
  }

  advance() {
    if (this.isAtEnd()) return "\0";
    const char = this.source[this.pos++];
    if (char === "\n") {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    return char;
  }

  skipWhitespace() {
    while (!this.isAtEnd()) {
      const char = this.peek();
      if (char === " " || char === "\r" || char === "\t" || char === "\n") {
        this.advance();
      } else if (char === "/" && this.peek(1) === "/") {
        while (!this.isAtEnd() && this.peek() !== "\n") {
          this.advance();
        }
      } else {
        break;
      }
    }
  }

  readIdentifierOrKeyword() {
    const startLine = this.line;
    const startCol = this.col;
    let value = "";

    while (!this.isAtEnd() && /[a-zA-Z0-9_]/.test(this.peek())) {
      value += this.advance();
    }

    const type = KEYWORDS.has(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
    return new Token(type, value, startLine, startCol);
  }

  readNumber() {
    const startLine = this.line;
    const startCol = this.col;
    let value = "";

    while (!this.isAtEnd() && /[0-9]/.test(this.peek())) {
      value += this.advance();
    }

    if (this.peek() === "." && /[0-9]/.test(this.peek(1))) {
      value += this.advance(); // consume '.'
      while (!this.isAtEnd() && /[0-9]/.test(this.peek())) {
        value += this.advance();
      }
    }

    return new Token(TokenType.NUMBER, value, startLine, startCol);
  }

  readString() {
    const startLine = this.line;
    const startCol = this.col;
    const quote = this.advance(); // consume " or '
    let value = "";

    while (!this.isAtEnd() && this.peek() !== quote) {
      // Support simple escape sequences
      if (this.peek() === "\\") {
        this.advance(); // consume backslash
        if (!this.isAtEnd()) {
          value += this.advance();
        }
      } else {
        value += this.advance();
      }
    }

    if (!this.isAtEnd()) {
      this.advance(); // consume closing quote
    }

    return new Token(TokenType.STRING, value, startLine, startCol);
  }

  readOperatorOrPunct() {
    const startLine = this.line;
    const startCol = this.col;
    const char = this.advance();

    // Two-character operators
    if (char === "=" && this.peek() === "=") {
      this.advance();
      if (this.peek() === "=") {
        this.advance();
        return new Token(TokenType.OPERATOR, "===", startLine, startCol);
      }
      return new Token(TokenType.OPERATOR, "==", startLine, startCol);
    }
    if (char === "!" && this.peek() === "=") {
      this.advance();
      if (this.peek() === "=") {
         this.advance();
         return new Token(TokenType.OPERATOR, "!==", startLine, startCol);
      }
      return new Token(TokenType.OPERATOR, "!=", startLine, startCol);
    }
    if ((char === "<" || char === ">" || char === "+" || char === "-" || char === "*" || char === "/") && this.peek() === "=") {
      this.advance();
      return new Token(TokenType.OPERATOR, char + "=", startLine, startCol);
    }
    
    if (this.isPunctuation(char)) {
      return new Token(TokenType.PUNCTUATION, char, startLine, startCol);
    }

    return new Token(TokenType.OPERATOR, char, startLine, startCol);
  }

  isPunctuation(char) {
    return ["(", ")", "{", "}", "[", "]", ",", ";", ".", ":"].includes(char);
  }

  nextToken() {
    this.skipWhitespace();

    if (this.isAtEnd()) {
      return new Token(TokenType.EOF, "", this.line, this.col);
    }

    const char = this.peek();

    if (/[a-zA-Z_]/.test(char)) {
      return this.readIdentifierOrKeyword();
    }

    if (/[0-9]/.test(char)) {
      return this.readNumber();
    }

    if (char === '"' || char === "'") {
      return this.readString();
    }

    return this.readOperatorOrPunct();
  }

  tokenize() {
    const tokens = [];
    let token = this.nextToken();
    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.nextToken();
    }
    tokens.push(token); // Add EOF
    return tokens;
  }
}
