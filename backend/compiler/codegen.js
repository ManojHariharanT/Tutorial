export class CodeGenerator {
  constructor(ast) {
    this.ast = ast;
    this.code = "";
    this.indentLevel = 0;
  }

  generate() {
    this.code = "";
    this.visit(this.ast);
    return this.code;
  }

  emit(str) {
    this.code += str;
  }

  emitLine(str = "") {
    if (str) {
      this.emit("  ".repeat(this.indentLevel) + str);
    }
    this.emit("\n");
  }

  visit(node) {
    if (!node) return;

    switch (node.type) {
      case "Program": {
        for (const stmt of node.body) {
          this.visit(stmt);
        }
        break;
      }

      case "BlockStatement": {
        this.emit("{\n");
        this.indentLevel++;
        for (const stmt of node.body) {
          this.emit("  ".repeat(this.indentLevel));
          this.visit(stmt);
        }
        this.indentLevel--;
        this.emitLine("}");
        break;
      }

      case "VarDeclaration": {
        this.emit(`${node.kind} ${node.id.name}`);
        if (node.init) {
          this.emit(" = ");
          this.visit(node.init);
        }
        this.emitLine(";");
        break;
      }

      case "Identifier": {
        this.emit(node.name);
        break;
      }

      case "Literal": {
        this.emit(node.raw);
        break;
      }

      case "BinaryExpression":
      case "AssignmentExpression": {
        // add parens generally to ensure prec, but for simplicity JS works mostly same
        this.emit("(");
        this.visit(node.left);
        this.emit(` ${node.operator} `);
        this.visit(node.right);
        this.emit(")");
        break;
      }

      case "ExpressionStatement": {
        this.visit(node.expression);
        this.emitLine(";");
        break;
      }

      case "IfStatement": {
        this.emit("if (");
        this.visit(node.test);
        this.emit(") ");
        if (node.consequent.type !== "BlockStatement") {
           this.emit("\n");
           this.indentLevel++;
           this.emit("  ".repeat(this.indentLevel));
           this.visit(node.consequent);
           this.indentLevel--;
        } else {
           this.visit(node.consequent);
        }

        if (node.alternate) {
          this.emit(" else ");
          if (node.alternate.type !== "BlockStatement" && node.alternate.type !== "IfStatement") {
            this.emit("\n");
            this.indentLevel++;
            this.emit("  ".repeat(this.indentLevel));
            this.visit(node.alternate);
            this.indentLevel--;
          } else {
            this.visit(node.alternate);
          }
        } else {
           if (node.consequent.type !== "BlockStatement") this.emitLine();
        }
        break;
      }

      case "FunctionDeclaration": {
        this.emit(`function ${node.id.name}(`);
        for (let i = 0; i < node.params.length; i++) {
          this.emit(node.params[i].name);
          if (i < node.params.length - 1) this.emit(", ");
        }
        this.emit(") ");
        this.visit(node.body);
        break;
      }

      case "CallExpression": {
        this.visit(node.callee);
        this.emit("(");
        for (let i = 0; i < node.arguments.length; i++) {
          this.visit(node.arguments[i]);
          if (i < node.arguments.length - 1) this.emit(", ");
        }
        this.emit(")");
        break;
      }

      case "MemberExpression": {
        this.visit(node.object);
        this.emit(".");
        this.emit(node.property.name);
        break;
      }

      case "ReturnStatement": {
        this.emit("return");
        if (node.argument) {
          this.emit(" ");
          this.visit(node.argument);
        }
        this.emitLine(";");
        break;
      }
    }
  }
}
