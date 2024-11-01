//=============================================================================
// Globals
//=============================================================================

const Calculator = {};

Calculator.latestOperand = 0;
Calculator.previousOperand = null;
Calculator.operand = null;

//=============================================================================
// UI Setup
//=============================================================================

Calculator.screenNode = document.querySelector("#screen");
console.log(Calculator.screenNode);

document.querySelector("button#evaluate").addEventListener("click", (e) => {
    console.log("Evaluate");
    const expression = Calculator.screenNode.innerText;
    const result = Calculator.evaluateExpression(expression);
    const resultText = Number.isNaN(result) ? "ERROR" : result.toString();
    Calculator.screenNode.innerText = resultText;
});

document.querySelector("button#clear").addEventListener("click", (e) => {
    console.log("Clear");
    Calculator.screenNode.innerText = "";
});

// TODO: Implement number buttons

// TODO: Implement decimal point button

// TODO: Implement operator buttons

//=============================================================================
// Calculator Logic
//=============================================================================

Calculator.appendDigit = function(digit) {
    // TODO
};

Calculator.appendBinaryOperator = function(operatorName) {
    // TODO
};

Calculator.operate = function(funcOperate, a, b) {
    return funcOperate(a, b);
};

// Binary operations

Calculator.add = function(a, b) {
    return a + b;
};

Calculator.subtract = function(a, b) {
    return a - b;
};

Calculator.multiply = function(a, b) {
    return a * b;
};

Calculator.divide = function(a, b) {
    return a / b;
};

// Unary operations

Calculator.squareRoot = function(num) {
    return Math.sqrt(num);
}

Calculator.square = function(num) {
    return num * num;
};