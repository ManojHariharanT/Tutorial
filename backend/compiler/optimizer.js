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
      this.commonSubexpressionElimination();
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

  commonSubexpressionElimination() {
    for (const block of this.blocks) {
      const expressions = new Map(); // "op+arg1+arg2" -> targetVar
      
      for (let i = 0; i < block.instructions.length; i++) {
        const inst = block.instructions[i];
        
        // Only arithmetic ops for now
        if (["+", "-", "*", "/"].includes(inst.op) && inst.args.length === 2) {
          const exprKey = `${inst.op}:${inst.args[0]}:${inst.args[1]}`;
          
          if (expressions.has(exprKey)) {
            const existingTarget = expressions.get(exprKey);
            // Replace this computation with an assignment from the previous result
            block.instructions[i] = {
              op: "assign",
              target: inst.target,
              args: [existingTarget]
            };
            this.hasChanged = true;
          } else {
            expressions.set(exprKey, inst.target);
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
            if (typeof arg === "string") {
              usedVars.add(arg);
            }
          });
        }
        if (inst.op === "call" && inst.callee) {
           usedVars.add(inst.callee);
        }
      }
    }

    // Now remove any 'assign' or arithmetic instruction whose target is NEVER used 
    for (const block of this.blocks) {
      const liveInstructions = [];
      for (const inst of block.instructions) {
        const isCompute = ["assign", "+", "-", "*", "/"].includes(inst.op);
        const isUnused = inst.target && !usedVars.has(inst.target) && inst.target.includes("_");
        
        if (isCompute && isUnused) {
            this.hasChanged = true;
            continue;
        }
        
        liveInstructions.push(inst);
      }
      block.instructions = liveInstructions;
    }
  }
}

