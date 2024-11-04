//=============================================================================
// Globals
//=============================================================================

const Calculator = {};

Calculator.buttonType = { none: 0, digit: 1, operator: 2 };
Calculator.EMPTY_TEXT = "0";
Calculator.ERROR_TEXT = "ERROR";

Calculator.currentText = "";
Calculator.previousOperand = null;
Calculator.operateFunction = null;
Calculator.lastButtonType = Calculator.buttonType.none;

//=============================================================================
// UI Setup
//=============================================================================

Calculator.resultNode = document.querySelector("#result");
Calculator.operatorButtons = document.querySelectorAll("button.operator");
Calculator.digitButtons = document.querySelectorAll

document.querySelector("button#evaluate").addEventListener("click", (e) => {
    // TODO: Implement
});

document.querySelector("button#clear").addEventListener("click", (e) => {
    Calculator.clear();
});

// TODO: Implement number buttons

// TODO: Implement decimal point button

// TODO: Implement operator buttons

document.addEventListener("DOMContentLoaded", (e) => {
    console.log("Loaded!");
    Calculator.clear();
});

//=============================================================================
// UI Update
//=============================================================================

Calculator.updateUI = function() {
    Calculator.resultNode.innerText = Calculator.currentText;
    // TODO: Enable/disable buttons as needed
};

//=============================================================================
// Calculator Logic
//=============================================================================

Calculator.backspace = function() {
    Calculator.currentText = Calculator.currentText.slice(0, -1);
    Calculator.updateUI();
};

Calculator.clear = function() {
    Calculator.previousOperand = null;
    Calculator.operateFunction = null;
    Calculator.currentText = "0";
    Calculator.updateUI();
};

Calculator.appendDigit = function(digit) {
    // TODO
};

Calculator.setBinaryOperator = function(operatorName) {
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