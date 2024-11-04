//=============================================================================
// Globals
//=============================================================================

const Calculator = {};

Calculator.EMPTY_TEXT = "0";
Calculator.ERROR_TEXT = "ERROR";


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
// Constants
//-----------------------------------------------------------------------------
Calculator.buttonType = {
    none: 0,
    digit: 1,
    operator: 2,
    square: 3,
    squareRoot: 4
};

//-----------------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------------
Calculator.errorState = false;
Calculator.previousNumber = null;
Calculator.operateFunction = null;
Calculator.lastButtonType = Calculator.buttonType.none;

Calculator._currentText = "";

//-----------------------------------------------------------------------------
// Properties
//-----------------------------------------------------------------------------

Object.defineProperties(Calculator, {
    currentNumber: {
        get: function() {
            return Number.parseFloat(this.currentText);
        },
        set: function(value) {
            if (Math.isNaN(value)) {
                this._errorState = true;
            }
            this.currentText = value.toString();
        }
    },
    currentText: {
        get: function() {
            if (this.errorState) {
                return this.ERROR_TEXT;
            } else {
                return this._currentText;
            }
        },
        set: function(value) {
            if (value == this._currentText) {
                return; // No change.
            } if (value == "") {
                this._currentText = this.EMPTY_TEXT;
            } else {
                this._currentText = value;
            }
            this.updateUI();
        }
    },
    operator: {
        get: function() {
            return this._operator;
        },
        set: function(value) {
            value = value.toLowerCase();
            if (value == "+" || value == "plus" || value.startsWith("add")) {
                this._operator = "+";
                this.operatorFunction = Calculator.add;
            } else if (value == '-' || value == "minus"
            || value.startsWith("sub")) {
                this._operator = "-";
                this.operatorFunction = Calculator.subtract;
            } else if (value == "*" || value == "x" || value == "times"
            || value.startsWith("mult")) {
                this._operator = "*";
                this.operatorFunction = Calculator.multiply;
            } else if (value == "/" || value.startsWith("div")) {
                this._operator = "/";
                this.operatorFunction = Calculator.divide;
            }
        }
    }
});

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
};

Calculator.clear = function() {
    Calculator.lastButtonType = Calculator.buttonType.none;
    Calculator.previousOperand = null;
    Calculator.operateFunction = null;
    Calculator.currentText = Calculator.EMPTY_TEXT;
    Calculator.errorState = false;
};

Calculator.appendDigit = function(digit) {
    Calculator.lastButtonType = Calculator.buttonType.digit;
    if (Calculator.currentText == Calculator.EMPTY_TEXT) {
        Calculator.currentText = digit;
    } else {
        Calculator.currentText += digit;
    }
};

Calculator.appendDecimalPoint = function() {
    Calculator.lastButtonType = Calculator.buttonType.digit;
    if (Calculator.currentText.includes(".")) {
        Calculator.errorState = true;
    } else {
        Calculator.currentText += ".";
    }
};

Calculator.setBinaryOperator = function(operatorName) {
    Calculator.lastButtonType = Calculator.buttonType.operator;
    // TODO
};

Calculator.evaluate = function() {
    // TODO
};

Calculator.applySquare = function() {
    // TODO
};

Calculator.applySquareRoot = function() {
    // TODO
};

//-----------------------------------------------------------------------------
// Operations
//-----------------------------------------------------------------------------

Calculator.operate = function(funcOperate, a, b) {
    return funcOperate(a, b);
};


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

