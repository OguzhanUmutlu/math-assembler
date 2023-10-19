// todo: recode in other languages (like C, C++ and Rust)

module.exports = function (code, startPoint = 0) {
    const tokens = tokenize(code);
    const program = {parent: null, children: []};
    let parent = program;

    function onEndExpression(token) {
        const last = parent.children[parent.children.length - 1];
        if (last === "*" || last === "/") {
            const rem = parent.children.splice(parent.children.length - 2, 2);
            parent.children.push([rem[0], rem[1], token]);
            return false;
        }
        if (last === "~" || last === "!") {
            parent.children.splice(parent.children.length - 1, 1);
            parent.children.push([token, "~"]);
            return false;
        }
        return true;
    }

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token === "(") {
            parent = {parent, children: []};
            continue;
        }
        if (token === ")") {
            if (!parent.parent) throw new Error("Unexpected token: )");
            let children = parent.children;
            if (children.length === 1) children = children[0];
            parent = parent.parent;
            if (onEndExpression(children)) parent.children.push(children);
            continue;
        }
        if (onEndExpression(token)) parent.children.push(token);
    }
    const instructions = [];
    compute(program.children, new Int32Array([startPoint]), instructions);
    return instructions;
};

function tokenize(code) {
    return code.replace(/ /g, "").split(/(\*\*|[+\-*/()~!])/g).filter(i => i);
}

function confirmExpression(expression, num, instructions) {
    if (Array.isArray(expression)) {
        const id = ++num[0];
        compute(expression, num, instructions);
        return `$${id}`;
    }
    return expression;
}

function compute(groups, num, instructions = []) {
    const fNum = num[0];
    const init = confirmExpression(groups[0], num, instructions);
    if (groups[1] === "~") {
        instructions.push(`$${fNum} =~ ${init}`);
        return;
    }
    instructions.push(`$${fNum} = ${init}`);
    for (let i = 1; i < groups.length - 1; i += 2) {
        const operator = groups[i];
        let thing = confirmExpression(groups[i + 1], num, instructions);
        instructions.push(`$${fNum} ${operator}= ${thing}`);
    }
}