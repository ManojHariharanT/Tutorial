let idCounter = 1;

export class SSABuilder {
  constructor(ast) {
    this.ast = ast;
    this.basicBlocks = [];
    this.currentBlock = this.createBlock("entry");
    this.variables = new Map(); // tracks current SSA version for variables (e.g., x -> x_1)
  }

  createBlock(name) {
    const block = { id: idCounter++, name, instructions: [], next: [], prev: [] };
    this.basicBlocks.push(block);
    return block;
  }

  connect(source, target) {
    source.next.push(target);
    target.prev.push(source);
  }

  getTempVar() {
    return `t${idCounter++}`;
  }

  getSSAVar(name) {
    if (!this.variables.has(name)) {
      this.variables.set(name, 0);
    }
    const version = this.variables.get(name);
    return `${name}_${version}`;
  }

  incrementSSAVar(name) {
    const version = (this.variables.get(name) || 0) + 1;
    this.variables.set(name, version);
    return `${name}_${version}`;
  }

  build() {
    this.visit(this.ast);
    return this.basicBlocks;
  }

  emit(instruction) {
    this.currentBlock.instructions.push(instruction);
  }

  visit(node) {
    if (!node) return null;
    const method = `visit${node.type}`;
    if (this[method]) {
      return this[method](node);
    }
  }

  visitProgram(node) {
    node.body.forEach(stmt => this.visit(stmt));
  }

  visitVarDeclaration(node) {
    const val = this.visit(node.init);
    const ssaTarget = this.incrementSSAVar(node.id.name);
    this.emit({ op: "assign", target: ssaTarget, args: [val] });
    return ssaTarget;
  }

  visitAssignmentExpression(node) {
    const val = this.visit(node.right);
    const targetName = node.left.name;
    const ssaTarget = this.incrementSSAVar(targetName);
    this.emit({ op: "assign", target: ssaTarget, args: [val] });
    return ssaTarget;
  }

  visitBinaryExpression(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);
    const tmp = this.getTempVar();
    this.emit({ op: node.operator, target: tmp, args: [left, right] });
    return tmp;
  }

  visitLiteral(node) {
    return node.value;
  }



  visitIdentifier(node) {
    return this.getSSAVar(node.name);
  }

  visitMemberExpression(node) {
    const obj = this.visit(node.object);
    const prop = node.property.name || node.property.value;
    const tmp = this.getTempVar();
    this.emit({ op: "get", target: tmp, object: obj, property: prop });
    return tmp;
  }

  visitCallExpression(node) {
    const callee = this.visit(node.callee);
    const args = node.arguments.map(arg => this.visit(arg));
    const tmp = this.getTempVar();
    this.emit({ op: "call", target: tmp, callee, args });
    return tmp;
  }

  visitExpressionStatement(node) {
    this.visit(node.expression);
  }

  visitFunctionDeclaration(node) {
    const fnBlock = this.createBlock(`fn_${node.id.name}`);
    const prevBlock = this.currentBlock;
    
    this.currentBlock = fnBlock;
    node.params.forEach(param => {
      const ssaTarget = this.incrementSSAVar(param.name);
      this.emit({ op: "param", target: ssaTarget });
    });
    
    this.visit(node.body);
    
    this.currentBlock = prevBlock;
  }

  visitBlockStatement(node) {
    node.body.forEach(stmt => this.visit(stmt));
  }

  visitReturnStatement(node) {
    const val = this.visit(node.expression);
    this.emit({ op: "return", args: [val] });
  }
}
