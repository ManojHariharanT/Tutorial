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

class Scope {
  constructor(parent = null) {
    this.parent = parent;
    this.symbols = new Map();
  }

  define(name, typeInfo, line, col) {
    if (this.symbols.has(name)) {
      throw new SemanticError(`Identifier '${name}' has already been declared.`, line, col);
    }
    this.symbols.set(name, typeInfo);
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
    // Inject some built-ins
    this.currentScope.define("console", { type: "built_in" }, 0, 0);
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
        // By default everything is inferable or any
        this.currentScope.define(node.id.name, { kind: node.kind }, node.line, node.col);
        break;
      }
      
      case "FunctionDeclaration": {
        this.currentScope.define(node.id.name, { kind: "function", params: node.params.length }, node.line, node.col);
        const previousScope = this.currentScope;
        this.currentScope = new Scope(previousScope);
        for (const param of node.params) {
          this.currentScope.define(param.name, { kind: "param" }, param.line, param.col);
        }
        this.visit(node.body);
        this.currentScope = previousScope;
        break;
      }
      
      case "Identifier": {
        const symbol = this.currentScope.resolve(node.name);
        // We may want to avoid throwing on undeclared to support JS built-ins in this toy compiler,
        // or we throw to be strictly safe. Let's just warn or ignore for now
        // if (!symbol) { throw new SemanticError(`Undeclared identifier '${node.name}'`, node.line, node.col); }
        break;
      }
      
      case "BinaryExpression":
      case "AssignmentExpression": {
        if (node.type === "AssignmentExpression") {
          if (node.left.type !== "Identifier") {
             throw new SemanticError(`Invalid left-hand side in assignment`, node.line, node.col);
          }
          // We could check if it's a const and throw error
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
        this.visit(node.alternate);
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
        // node.property is just an Identifier in dot notation, not evaluated
        break;
      }
      
      case "ReturnStatement": {
        this.visit(node.argument);
        break;
      }
      
      case "Literal":
        break;
    }
  }
}
