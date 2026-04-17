export const TokenType = {
  EOF: "EOF",
  IDENTIFIER: "IDENTIFIER",
  NUMBER: "NUMBER",
  STRING: "STRING",
  KEYWORD: "KEYWORD",
  OPERATOR: "OPERATOR",
  PUNCTUATION: "PUNCTUATION", // commas, semicolons, brackets
  COMMENT: "COMMENT",
  WHITESPACE: "WHITESPACE"
};

export class Token {
  constructor(type, value, line, col) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.col = col;
  }
}
