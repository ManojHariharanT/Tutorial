export class Optimizer {
  constructor(basicBlocks) {
    this.blocks = basicBlocks;
    this.hasChanged = false;
  }

  optimize() {
    do {
      this.hasChanged = false;
      this.constantFolding();
      this.deadCodeElimination();
    } while (this.hasChanged);

    return this.blocks;
  }

  constantFolding() {
    for (const block of this.blocks) {
      for (let i = 0; i < block.instructions.length; i++) {
        const inst = block.instructions[i];

        // Fold binary operations if both args are strictly numeric
        if (["+", "-", "*", "/"].includes(inst.op) && inst.args.length === 2) {
          const left = inst.args[0];
          const right = inst.args[1];

          if (typeof left === "number" && typeof right === "number") {
            let folded;
            switch (inst.op) {
              case "+": folded = left + right; break;
              case "-": folded = left - right; break;
              case "*": folded = left * right; break;
              case "/": folded = left / right; break;
            }

            // Replace current operation with direct assignment of folded primitive
            block.instructions[i] = {
              op: "assign",
              target: inst.target,
              args: [folded]
            };
            this.hasChanged = true;
          }
        }
      }
    }
  }

  deadCodeElimination() {
    // Collect all variables that are read (args array, or callee calls)
    const usedVars = new Set();
    
    for (const block of this.blocks) {
      for (const inst of block.instructions) {
        if (inst.args) {
          inst.args.forEach(arg => {
            if (typeof arg === "string" && arg.includes("_")) {
              usedVars.add(arg);
            }
          });
        }
        if (inst.op === "call" && inst.callee) {
          // callee is a function identifier but target is temporary
        }
      }
    }

    // Now remove any 'assign' instruction whose target is NEVER used 
    for (const block of this.blocks) {
      const liveInstructions = [];
      for (const inst of block.instructions) {
        if (inst.op === "assign" || inst.op === "+" || inst.op === "-" || inst.op === "*" || inst.op === "/") {
          if (!usedVars.has(inst.target) && inst.target.includes("_")) {
            // It's dead code, skip it
            this.hasChanged = true;
            continue;
          }
        }
        
        liveInstructions.push(inst);
      }
      block.instructions = liveInstructions;
    }
  }
}
