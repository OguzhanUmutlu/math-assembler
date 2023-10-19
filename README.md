# math-assembler

An assembler that converts mathematical operations into a list of instructions.

# Examples

Input:

```
x + y
```

Output:

```
$0 = x
$0 += y
```

This output is an instruction on how to execute the given math expression `2 + 2`

First line `$0 = x` assigns `x` to the variable named `#0`

Second line `$0 += y` adds `y` to the variable named `#0`

# Instruction list

## Assign

Assigns the number/variable to a variable.

Format: `$0 = x` or `$0 = $1`

## Operation

Does an operation on a variable using a number/variable.

Format: `$0 += x` or `$0 += $1`

## Negation

This is a special operation that negates a number/variable and
assigns the negated value to a variable.

Format: `$0 =~ x` or `$0 =~ $1`