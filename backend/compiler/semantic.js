import {
  Program, BlockStatement, VarDeclaration, Identifier,
  Literal, BinaryExpression, ExpressionStatement,
  AssignmentExpression, IfStatement, FunctionDeclaration,
  CallExpression, ReturnStatement
} from "./ast.js";

export class SemanticError extends Error {
  constructor(message, line, col) {
    super(`[Line ${line}, Col ${col}] Semantic Error: ${message}`);
    this.line = line;
    this.col = col;
    this.name = "SemanticError";
  }
}

class Symbol {
  constructor(name, info, line, col) {
    this.name = name;
    this.info = info; // { kind: 'function'|'var'|..., params: ... }
    this.line = line;
    this.col = col;
  }
}

class Scope {
  constructor(parent = null) {
    this.parent = parent;
    this.symbols = new Map();
  }

  define(name, typeInfo, line, col) {
    if (this.symbols.has(name)) {
      throw new SemanticError(`Identifier '${name}' has already been declared.`, line, col);
    }
    const symbol = new Symbol(name, typeInfo, line, col);
    this.symbols.set(name, symbol);
    return symbol;
  }

  resolve(name) {
    if (this.symbols.has(name)) {
      return this.symbols.get(name);
    }
    if (this.parent) {
      return this.parent.resolve(name);
    }
    return null;
  }
}

export class SemanticAnalyzer {
  constructor(ast) {
    this.ast = ast;
    this.currentScope = new Scope(); // Global scope
    this.identifierMap = new Map(); // Identifier Node -> Symbol
    
    // Inject built-ins
    this.currentScope.define("console", { kind: "built_in" }, 0, 0);
  }

  analyze() {
    this.visit(this.ast);
  }

  visit(node) {
    if (!node) return;
    
    switch (node.type) {
      case "Program":
      case "BlockStatement": {
        const previousScope = this.currentScope;
        if (node.type === "BlockStatement") {
          this.currentScope = new Scope(previousScope);
        }
        for (const stmt of node.body) {
          this.visit(stmt);
        }
        this.currentScope = previousScope;
        break;
      }
      
      case "VarDeclaration": {
        this.visit(node.init);
        const symbol = this.currentScope.define(node.id.name, { kind: node.kind }, node.line, node.col);
        this.identifierMap.set(node.id, symbol);
        break;
      }
      
      case "FunctionDeclaration": {
        const fnSymbol = this.currentScope.define(node.id.name, { 
          kind: "function", 
          params: node.params.map(p => p.name) 
        }, node.line, node.col);
        this.identifierMap.set(node.id, fnSymbol);

        const previousScope = this.currentScope;
        this.currentScope = new Scope(previousScope);
        for (const param of node.params) {
          const paramSymbol = this.currentScope.define(param.name, { kind: "param" }, param.line, param.col);
          this.identifierMap.set(param, paramSymbol);
        }
        this.visit(node.body);
        this.currentScope = previousScope;
        break;
      }
      
      case "Identifier": {
        const symbol = this.currentScope.resolve(node.name);
        if (symbol) {
          this.identifierMap.set(node, symbol);
        }
        break;
      }
      
      case "BinaryExpression":
      case "AssignmentExpression": {
        if (node.type === "AssignmentExpression") {
          if (node.left.type !== "Identifier") {
             throw new SemanticError(`Invalid left-hand side in assignment`, node.line, node.col);
          }
        }
        this.visit(node.left);
        this.visit(node.right);
        break;
      }
      
      case "ExpressionStatement": {
        this.visit(node.expression);
        break;
      }
      
      case "IfStatement": {
        this.visit(node.test);
        this.visit(node.consequent);
        if (node.alternate) this.visit(node.alternate);
        break;
      }
      
      case "CallExpression": {
        this.visit(node.callee);
        for (const arg of node.arguments) {
          this.visit(arg);
        }
        break;
      }
      
      case "MemberExpression": {
        this.visit(node.object);
        break;
      }
      
      case "ReturnStatement": {
        if (node.argument) this.visit(node.argument);
        break;
      }
      
      case "Literal":
        break;
    }
  }

  /**
   * Helper for LSP to find the symbol at a cursor position
   */
  findSymbolAt(line, col) {
    let closestNode = null;
    
    // We can iterate over identifierMap to find an identifier that overlaps line/col
    // For simplicity, we just check if it matches the start position
    // In a real editor, identifiers have length. Let's assume name length.
    for (const [node, symbol] of this.identifierMap.entries()) {
      if (node.line === line) {
        if (col >= node.col && col <= node.col + (node.name ? node.name.length : 0)) {
           return symbol;
        }
      }
    }
    return null;
  }
}

