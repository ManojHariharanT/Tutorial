import { TokenType } from "./token.js";
import {
  Program, BlockStatement, VarDeclaration, Identifier,
  Literal, BinaryExpression, ExpressionStatement,
  AssignmentExpression, IfStatement, FunctionDeclaration,
  CallExpression, ReturnStatement, MemberExpression
} from "./ast.js";

const PRECEDENCE = {
  "=": 1,
  "+=": 1, "-=": 1, "*=": 1, "/=": 1,
  "||": 2,
  "&&": 3,
  "==": 4, "!=": 4, "===": 4, "!==": 4,
  "<": 5, ">": 5, "<=": 5, ">=": 5,
  "+": 6, "-": 6,
  "*": 7, "/": 7,
  "(": 8, // function call
  ".": 9  // member access
};

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
    this.errors = [];
  }

  peek(offset = 0) {
    if (this.pos + offset >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1]; // EOF token
    }
    return this.tokens[this.pos + offset];
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  advance() {
    if (!this.isAtEnd()) this.pos++;
    return this.tokens[this.pos - 1];
  }

  match(type, value) {
    const token = this.peek();
    if (token.type === type && (value === undefined || token.value === value)) {
      this.advance();
      return true;
    }
    return false;
  }

  consume(type, value, errorMessage) {
    if (this.match(type, value)) {
      return this.tokens[this.pos - 1];
    }
    this.error(this.peek(), errorMessage || `Expected ${type} ${value ? "'" + value + "'" : ""}`);
    return null;
  }

  error(token, message) {
    const errorMsg = `[Line ${token.line}, Col ${token.col}] Error: ${message}`;
    this.errors.push(errorMsg);
    throw new Error(errorMsg);
  }

  synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.tokens[this.pos - 1].value === ";") return;
      
      switch (this.peek().value) {
        case "function":
        case "let":
        case "const":
        case "var":
        case "if":
        case "while":
        case "for":
        case "return":
          return;
      }
      this.advance();
    }
  }

  parseProgram() {
    const token = this.peek();
    const statements = [];
    while (!this.isAtEnd()) {
      try {
        statements.push(this.parseStatement());
      } catch (err) {
        this.synchronize();
      }
    }
    return new Program(statements, token.line, token.col);
  }

  parseStatement() {
    const token = this.peek();
    if (token.type === TokenType.KEYWORD) {
      switch (token.value) {
        case "let":
        case "const":
        case "var":
          return this.parseVarDeclaration();
        case "function":
          return this.parseFunctionDeclaration();
        case "if":
          return this.parseIfStatement();
        case "return":
          return this.parseReturnStatement();
      }
    }
    
    if (token.type === TokenType.PUNCTUATION && token.value === "{") {
      return this.parseBlockStatement();
    }

    return this.parseExpressionStatement();
  }

  parseBlockStatement() {
    const startToken = this.consume(TokenType.PUNCTUATION, "{");
    const statements = [];
    while (!this.isAtEnd() && this.peek().value !== "}") {
      statements.push(this.parseStatement());
    }
    this.consume(TokenType.PUNCTUATION, "}");
    return new BlockStatement(statements, startToken.line, startToken.col);
  }

  parseVarDeclaration() {
    const keywordToken = this.advance(); // let, const, var
    const idToken = this.consume(TokenType.IDENTIFIER, undefined, "Expected variable name.");
    const id = new Identifier(idToken.value, idToken.line, idToken.col);
    
    let init = null;
    if (this.match(TokenType.OPERATOR, "=")) {
      init = this.parseExpression();
    }
    
    this.match(TokenType.PUNCTUATION, ";");
    return new VarDeclaration(keywordToken.value, id, init, keywordToken.line, keywordToken.col);
  }

  parseFunctionDeclaration() {
    const fnToken = this.advance();
    const idToken = this.consume(TokenType.IDENTIFIER, undefined, "Expected function name.");
    const id = new Identifier(idToken.value, idToken.line, idToken.col);
    
    this.consume(TokenType.PUNCTUATION, "(", "Expected '(' after function name.");
    const params = [];
    if (this.peek().value !== ")") {
      do {
        const paramToken = this.consume(TokenType.IDENTIFIER, undefined, "Expected parameter name.");
        params.push(new Identifier(paramToken.value, paramToken.line, paramToken.col));
      } while (this.match(TokenType.PUNCTUATION, ","));
    }
    this.consume(TokenType.PUNCTUATION, ")", "Expected ')' after parameters.");
    
    const body = this.parseBlockStatement();
    return new FunctionDeclaration(id, params, body, fnToken.line, fnToken.col);
  }

  parseIfStatement() {
    const ifToken = this.advance();
    this.consume(TokenType.PUNCTUATION, "(", "Expected '(' after 'if'.");
    const test = this.parseExpression();
    this.consume(TokenType.PUNCTUATION, ")", "Expected ')' after if condition.");
    
    const consequent = this.parseStatement();
    let alternate = null;
    if (this.match(TokenType.KEYWORD, "else")) {
      alternate = this.parseStatement();
    }
    
    return new IfStatement(test, consequent, alternate, ifToken.line, ifToken.col);
  }

  parseReturnStatement() {
    const returnToken = this.advance();
    let argument = null;
    if (this.peek().value !== ";") {
      argument = this.parseExpression();
    }
    this.match(TokenType.PUNCTUATION, ";");
    return new ReturnStatement(argument, returnToken.line, returnToken.col);
  }

  parseExpressionStatement() {
    const expr = this.parseExpression();
    this.match(TokenType.PUNCTUATION, ";");
    return new ExpressionStatement(expr, expr.line, expr.col);
  }

  parseExpression(minPrecedence = 0) {
    let left = this.parsePrimary();

    while (true) {
      const token = this.peek();
      if (token.type === TokenType.EOF || token.value === ";" || token.value === "," || token.value === ")" || token.value === "}") {
        break;
      }

      let prec = PRECEDENCE[token.value] || 0;
      if (token.value === "(") prec = PRECEDENCE["("];

      if (prec === 0 || prec < minPrecedence) {
        break;
      }

      const opToken = this.advance();

      if (opToken.value === "(") {
        left = this.parseCallExpression(left, opToken);
        continue;
      }

      if (opToken.value === ".") {
        const propToken = this.consume(TokenType.IDENTIFIER, undefined, "Expected property name after '.'.");
        left = new MemberExpression(left, new Identifier(propToken.value, propToken.line, propToken.col), opToken.line, opToken.col);
        continue;
      }

      // right-associative for assignment
      const rightAssoc = opToken.value === "=" || opToken.value.endsWith("=");
      const nextMinPrec = rightAssoc ? prec : prec + 1;

      const right = this.parseExpression(nextMinPrec);

      if (opToken.value === "=" || opToken.value.endsWith("=")) {
        left = new AssignmentExpression(opToken.value, left, right, left.line, left.col);
      } else {
        left = new BinaryExpression(opToken.value, left, right, left.line, left.col);
      }
    }

    return left;
  }

  parseCallExpression(callee, parenToken) {
    const args = [];
    if (this.peek().value !== ")") {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.PUNCTUATION, ","));
    }
    this.consume(TokenType.PUNCTUATION, ")", "Expected ')' after arguments.");
    return new CallExpression(callee, args, parenToken.line, parenToken.col);
  }

  parsePrimary() {
    const token = this.advance();

    if (token.type === TokenType.NUMBER) {
      return new Literal(parseFloat(token.value), token.value, token.line, token.col);
    }
    if (token.type === TokenType.STRING) {
      return new Literal(token.value, `"${token.value}"`, token.line, token.col);
    }
    if (token.type === TokenType.IDENTIFIER) {
      return new Identifier(token.value, token.line, token.col);
    }
    if (token.type === TokenType.KEYWORD && (token.value === "true" || token.value === "false")) {
      return new Literal(token.value === "true", token.value, token.line, token.col);
    }
    if (token.type === TokenType.KEYWORD && token.value === "null") {
      return new Literal(null, token.value, token.line, token.col);
    }
    if (token.type === TokenType.PUNCTUATION && token.value === "(") {
      const expr = this.parseExpression();
      this.consume(TokenType.PUNCTUATION, ")", "Expected ')' after group.");
      return expr;
    }

    this.error(token, `Unexpected primary expression token: '${token.value}'`);
  }
}
