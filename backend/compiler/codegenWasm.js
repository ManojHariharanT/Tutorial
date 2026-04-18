export class WasmCodeGenerator {
  constructor(basicBlocks) {
    this.blocks = basicBlocks;
    this.wat = "";
    this.indentLevel = 0;
    this.locals = new Set();
  }

  emit(str) {
    this.wat += "  ".repeat(this.indentLevel) + str + "\n";
  }

  generate() {
    this.wat = "(module\n";
    this.indentLevel++;
    
    // For a toy language, we assume all variables are i32
    // We need to collect all variables used across all blocks to declare them as locals
    // BUT WASM functions have their own locals.
    // Our SSABuilder currently puts everything in one list of blocks, but name prefixes like 'fn_' indicate functions.
    
    const functions = this.groupBlocksByFunction();
    
    // Import console.log as a host function (mapped to an i32 printer)
    this.emit("(import \"js\" \"log\" (func $log (param i32)))");

    for (const [fnName, blocks] of Object.entries(functions)) {
      this.generateFunction(fnName, blocks);
    }
    
    // Export the entry point if it exists
    if (functions["entry"]) {
      this.emit("(export \"main\" (func $entry))");
    }

    this.indentLevel--;
    this.wat += ")";
    return this.wat;
  }

  groupBlocksByFunction() {
    const functions = { "entry": [] };
    let currentFn = "entry";
    
    for (const block of this.blocks) {
      if (block.name.startsWith("fn_")) {
        currentFn = block.name;
        functions[currentFn] = [];
      }
      functions[currentFn].push(block);
    }
    return functions;
  }

  generateFunction(fnName, blocks) {
    const name = fnName === "entry" ? "$entry" : `$${fnName.replace("fn_", "")}`;
    
    // Determine params
    const params = [];
    const internalLocals = new Set();
    
    for (const block of blocks) {
      for (const inst of block.instructions) {
        if (inst.op === "param") {
          params.push(inst.target);
        } else if (inst.target) {
          internalLocals.add(inst.target);
        }
      }
    }
    
    // Remove params from locals
    params.forEach(p => internalLocals.delete(p));

    let funcHeader = `(func ${name}`;
    params.forEach(p => {
      funcHeader += ` (param $${p} i32)`;
    });
    // For simplicity, we assume functions return i32 if they have a return statement
    const hasReturn = blocks.some(b => b.instructions.some(i => i.op === "return"));
    if (hasReturn) funcHeader += " (result i32)";
    funcHeader += "";
    
    this.emit(funcHeader);
    this.indentLevel++;
    
    // Declare locals
    for (const local of internalLocals) {
      this.emit(`(local $${local} i32)`);
    }

    for (const block of blocks) {
      for (const inst of block.instructions) {
        this.generateInstruction(inst);
      }
    }

    this.indentLevel--;
    this.emit(")");
  }

  generateInstruction(inst) {
    switch (inst.op) {
      case "param":
        // Already handled in function header
        break;
      case "assign":
        this.pushValue(inst.args[0]);
        this.emit(`local.set $${inst.target}`);
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        this.pushValue(inst.args[0]);
        this.pushValue(inst.args[1]);
        const op = inst.op === "+" ? "add" : inst.op === "-" ? "sub" : inst.op === "*" ? "mul" : "div_s";
        this.emit(`i32.${op}`);
        this.emit(`local.set $${inst.target}`);
        break;
      case "call":
        if (inst.callee === "console_0") { // mapped from 'console.log'
           inst.args.forEach(arg => this.pushValue(arg));
           this.emit("call $log");
        } else {
           inst.args.forEach(arg => this.pushValue(arg));
           this.emit(`call $${inst.callee.replace("_0", "")}`);
           this.emit(`local.set $${inst.target}`);
        }
        break;
      case "return":
        this.pushValue(inst.args[0]);
        this.emit("return");
        break;
    }
  }

  pushValue(val) {
    if (typeof val === "number") {
      this.emit(`i32.const ${val}`);
    } else if (typeof val === "string") {
      this.emit(`local.get $${val}`);
    }
  }
}
