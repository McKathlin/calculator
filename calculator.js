//=============================================================================
// Globals
//=============================================================================

const Calculator = {};

Calculator.buttonType = { none: 0, digit: 1, operator: 2, unary: 3 };
Calculator.EMPTY_TEXT = "0";
Calculator.ERROR_TEXT = "ERROR";

Calculator.errorState = false;
Calculator.currentText = "";
Calculator.previousNumber = null;
Calculator.operateFunction = null;
Calculator.lastButtonType = Calculator.buttonType.none;

//=============================================================================
// UI Setup
//=============================================================================

Calculator.resultNode = document.querySelector("#result");

// Unique buttons
Calculator.backspaceButton = document.querySelector("button#backspace");
Calculator.clearButton = document.querySelector("button#clear");
Calculator.decimalPointButton = document.querySelector("button#decimal-point");
Calculator.equalsButton = document.querySelector("button#equals");

// Button groups
Calculator.operatorButtons = document.querySelectorAll("button.operator");
Calculator.digitButtons = document.querySelectorAll("button.digit");

Calculator.backspaceButton.addEventListener("click", (e) => {
    // TODO
});

Calculator.clearButton.addEventListener("click", (e) => {
    Calculator.clear();
});

Calculator.decimalPointButton.addEventListener("click", (e) => {
    // TODO
});

Calculator.equalsButton.addEventListener("click", (e) => {
    // TODO
});

// TODO: Implement number buttons

// TODO: Implement operator buttons

// TODO: Implement unary buttons

document.addEventListener("DOMContentLoaded", (e) => {
    console.log("Loaded!");
    Calculator.clear();
});

//=============================================================================
// UI Update
//=============================================================================

Calculator.updateUI = function() {
    if (Calculator.errorState) {
        Calculator.resultNode.innerText = Calculator.ERROR_TEXT;
    } else {
        Calculator.resultNode.innerText = Calculator.currentText;
    }
    
    // TODO: Enable/disable buttons as needed
};

//=============================================================================
// Calculator Logic
//=============================================================================

Calculator.backspace = function() {
    if (Calculator.errorState) {
        // Don't change error state.
    } else if (Calculator.currentText == Calculator.EMPTY_TEXT) {
        // Already empty. Do nothing.
    } else {
        // Remove the last character.
        Calculator.currentText = Calculator.currentText.slice(0, -1);
    }
    Calculator.updateUI();
};

Calculator.clear = function() {
    Calculator.previousOperand = null;
    Calculator.operateFunction = null;
    Calculator.currentText = Calculator.EMPTY_TEXT;
    Calculator.errorState = false;
    Calculator.updateUI();
};

Calculator.appendDigit = function(digit) {
    // TODO
};

Calculator.appendDecimalPoint = function() {
    if (Calculator.currentText.includes(".")) {
        Calculator.errorState = true;
    } else {
        Calculator.currentText += ".";
    }
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

//-----------------------------------------------------------------------------
// Helper methods
//-----------------------------------------------------------------------------

Calculator._getCurrentNumber = function() {
    return Number.parseFloat(Calculator.currentText);
};