const build = require("../src/main.js");

const instructions = build(`~(((x)))`);
console.log("Instructions:");
console.log(instructions.join("\n"));