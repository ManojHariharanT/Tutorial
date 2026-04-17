export class ASTNode {
  constructor(line, col) {
    this.line = line;
    this.col = col;
  }
}

export class Program extends ASTNode {
  constructor(body, line, col) {
    super(line, col);
    this.type = "Program";
    this.body = body; // ASTNode[]
  }
}

export class BlockStatement extends ASTNode {
  constructor(body, line, col) {
    super(line, col);
    this.type = "BlockStatement";
    this.body = body; // ASTNode[]
  }
}

export class VarDeclaration extends ASTNode {
  constructor(kind, id, init, line, col) {
    super(line, col);
    this.type = "VarDeclaration";
    this.kind = kind; // let, const, var
    this.id = id; // Identifier
    this.init = init; // Expression | null
  }
}

export class Identifier extends ASTNode {
  constructor(name, line, col) {
    super(line, col);
    this.type = "Identifier";
    this.name = name;
  }
}

export class Literal extends ASTNode {
  constructor(value, raw, line, col) {
    super(line, col);
    this.type = "Literal";
    this.value = value;
    this.raw = raw;
  }
}

export class BinaryExpression extends ASTNode {
  constructor(operator, left, right, line, col) {
    super(line, col);
    this.type = "BinaryExpression";
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class ExpressionStatement extends ASTNode {
  constructor(expression, line, col) {
    super(line, col);
    this.type = "ExpressionStatement";
    this.expression = expression;
  }
}

export class AssignmentExpression extends ASTNode {
  constructor(operator, left, right, line, col) {
    super(line, col);
    this.type = "AssignmentExpression";
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class IfStatement extends ASTNode {
  constructor(test, consequent, alternate, line, col) {
    super(line, col);
    this.type = "IfStatement";
    this.test = test; // Expression
    this.consequent = consequent; // Statement
    this.alternate = alternate; // Statement | null
  }
}

export class FunctionDeclaration extends ASTNode {
  constructor(id, params, body, line, col) {
    super(line, col);
    this.type = "FunctionDeclaration";
    this.id = id; // Identifier
    this.params = params; // Identifier[]
    this.body = body; // BlockStatement
  }
}

export class CallExpression extends ASTNode {
  constructor(callee, args, line, col) {
    super(line, col);
    this.type = "CallExpression";
    this.callee = callee; // Expression
    this.arguments = args; // Expression[]
  }
}

export class MemberExpression extends ASTNode {
  constructor(object, property, line, col) {
    super(line, col);
    this.type = "MemberExpression";
    this.object = object;
    this.property = property;
  }
}

export class ReturnStatement extends ASTNode {
  constructor(argument, line, col) {
    super(line, col);
    this.type = "ReturnStatement";
    this.argument = argument; // Expression | null
  }
}
