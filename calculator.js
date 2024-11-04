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
    Calculator.backspace();
});

Calculator.clearButton.addEventListener("click", (e) => {
    Calculator.clear();
});

Calculator.decimalPointButton.addEventListener("click", (e) => {
    Calculator.appendDecimalPoint();
});

Calculator.equalsButton.addEventListener("click", (e) => {
    Calculator.evalute();
});

for (let button of Calculator.digitButtons) {
    button.addEventListener("click", (e) => {
        Calculator.appendDigit(e.target.id);
    });
}

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
// Button functions
//-----------------------------------------------------------------------------

Calculator.backspace = function() {
    if (Calculator.errorState) {
        // Don't change error state.
    } else if (Calculator.currentText == Calculator.EMPTY_TEXT) {
        // Already empty. Do nothing.
    } else if (Calculator.lastButtonType == Calculator.buttonType.operator) {
        // Undo operator selection.
        Calculator.operateFunction = null;
        Calculator.lastButtonType = Calculator.buttonType.none;
    } else {
        // Remove the last character.
        Calculator.lastButtonType = Calculator.buttonType.none;
        Calculator.currentText = Calculator.currentText.slice(0, -1);
        if (Calculator.currentText == "") {
            Calculator.currentText = Calculator.EMPTY_TEXT;
        }
    }
    Calculator.updateUI();
};

Calculator.clear = function() {
    Calculator.lastButtonType = Calculator.buttonType.none;
    Calculator.previousOperand = null;
    Calculator.operateFunction = null;
    Calculator.currentText = Calculator.EMPTY_TEXT;
    Calculator.errorState = false;
    Calculator.updateUI();
};

Calculator.appendDigit = function(digit) {
    Calculator.lastButtonType = Calculator.buttonType.digit;
    if (Calculator.currentText == Calculator.EMPTY_TEXT) {
        Calculator.currentText = "";
    }
    Calculator.currentText += digit;
    Calculator.updateUI();
};

Calculator.appendDecimalPoint = function() {
    Calculator.lastButtonType = Calculator.buttonType.digit;
    if (Calculator.currentText.includes(".")) {
        Calculator.errorState = true;
    } else {
        Calculator.currentText += ".";
    }
    Calculator.updateUI();
};

Calculator.setBinaryOperator = function(operatorName) {
    Calculator.lastButtonType = Calculator.buttonType.operator;
    // TODO
};

Calculator.evalute = function() {
    // TODO
};

Calculator.operate = function(funcOperate, a, b) {
    return funcOperate(a, b);
};

//-----------------------------------------------------------------------------
// Operations
//-----------------------------------------------------------------------------

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

Calculator.squareRoot = function(num) {
    return Math.sqrt(num);
}

Calculator.square = function(num) {
    return num * num;
};

//-----------------------------------------------------------------------------
// Helper functions
//-----------------------------------------------------------------------------

Calculator._getCurrentNumber = function() {
    return Number.parseFloat(Calculator.currentText);
};