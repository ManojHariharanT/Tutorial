import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { SemanticAnalyzer } from "./semantic.js";
import { SSABuilder } from "./ssa.js";
import { Optimizer } from "./optimizer.js";
import { CodeGenerator } from "./codegen.js";
import { WasmCodeGenerator } from "./codegenWasm.js";

export function compileSource(source) {
  // Phase 1: Lexical Analysis
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();

  // Phase 2: Parsing
  const parser = new Parser(tokens);
  const ast = parser.parseProgram();

  if (parser.errors.length > 0) {
    throw new Error("Syntax Errors:\n" + parser.errors.join("\n"));
  }

  // Phase 3: Semantic Analysis
  const analyzer = new SemanticAnalyzer(ast);
  analyzer.analyze();

  // Phase 4: IR & SSA Generation
  const ssaBuilder = new SSABuilder(ast);
  const rawIR = ssaBuilder.build();

  // Phase 5: SSA Optimization
  const optimizer = new Optimizer(rawIR);
  const optimizedIR = optimizer.optimize();

  // Phase 6a: Code Generation (target: JS)
  const generator = new CodeGenerator(ast);
  const jsCode = generator.generate();

  // Phase 6b: Code Generation (target: WASM Text)
  const wasmGenerator = new WasmCodeGenerator(optimizedIR);
  const watCode = wasmGenerator.generate();

  return {
    tokens,
    ast,
    ir: optimizedIR,
    jsCode,
    watCode,
    analyzer // Expose semantic data for LSP
  };
}


