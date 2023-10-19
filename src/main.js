module.exports = function (code, startPoint = 0) {
    const tokens = tokenize(code);
    const program = {parent: null, children: []};
    let parent = program;
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token === "(") {
            parent.children.push(parent = {parent, children: []});
            continue;
        }
        if (token === ")") {
            if (!parent.parent) throw new Error("Unexpected token: )");
            parent.parent.children[parent.parent.children.length - 1] = parent.children;
            parent = parent.parent;
            continue;
        }
        const last = parent.children[parent.children.length - 1];
        if (last === "*" || last === "/") {
            const rem = parent.children.splice(parent.children.length - 2, 2);
            parent.children.push([...rem, token]);
        } else {
            parent.children.push(token);
        }
    }
    const instructions = [];
    compute(program.children, startPoint, instructions);
    instructions.push("return #0");
    return instructions;
};

function tokenize(code) {
    return code.replace(/ /g, "").split(/(\*\*|[+\-*/()])/g)
}

function compute(groups, num, instructions = []) {
    const fNum = num;
    let init = groups[0];
    if (typeof init === "object") {
        const id = ++num;
        compute(init, id, instructions);
        init = `(#${id})`;
    }
    instructions.push(`(#${fNum}) = ${init}`);
    for (let i = 1; i < groups.length - 1; i += 2) {
        const op = groups[i];
        let thing = groups[i + 1];
        if (typeof thing === "object") {
            const id = ++num;
            compute(thing, id, instructions);
            thing = `(#${id})`;
        }
        if (thing[0] === "#") thing = `(${thing})`;
        instructions.push(`(#${fNum}) ${op}= ${thing}`);
    }
}