const build = require("../src/main.js");

const instructions = build(`2 + 2 * 2 + #myVar`);
console.log("Instructions:");
console.log(instructions.join("\n"));