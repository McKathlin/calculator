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
    Calculator.evaluate();
});

for (let button of Calculator.digitButtons) {
    button.addEventListener("click", (e) => {
        Calculator.appendDigit(e.target.id);
    });
}

for (let button of Calculator.operatorButtons) {
    button.addEventListener("click", (e) => {
        Calculator.setBinaryOperator(e.target.id);
    });
}

// TODO: Implement unary buttons

document.addEventListener("DOMContentLoaded", (e) => {
    console.log("Loaded!");
    Calculator.clear();
});

//=============================================================================
// UI Update
//=============================================================================

Calculator.updateUI = function() {
    this.resultNode.innerText = this.currentText;
    
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
            } else if (this.lastButtonType == Calculator.buttonType.operator) {
                return this.previousNumber.toString();
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
            if (value) {
                this._operator = this.getFunctionNameForOperator(value);
            } else {
                this._operator = null;
            }
        }
    }
});

//-----------------------------------------------------------------------------
// Button functions
//-----------------------------------------------------------------------------

Calculator.backspace = function() {
    if (this.errorState) {
        // Don't change error state.
    } else if (this.currentText == Calculator.EMPTY_TEXT) {
        // Already empty. Do nothing.
    } else if (this.lastButtonType == Calculator.buttonType.operator) {
        // Undo operator selection.
        this.operateFunction = null;
        this.lastButtonType = Calculator.buttonType.none;
    } else {
        // Remove the last character.
        Calculator.lastButtonType = Calculator.buttonType.none;
        this.currentText = Calculator.currentText.slice(0, -1);
        if (this.currentText == "") {
            this.currentText = Calculator.EMPTY_TEXT;
        }
    }
};

Calculator.clear = function() {
    this.lastButtonType = Calculator.buttonType.none;
    this.previousOperand = null;
    this.operateFunction = null;
    this.currentText = Calculator.EMPTY_TEXT;
    this.errorState = false;
};

Calculator.appendDigit = function(digit) {
    this.lastButtonType = Calculator.buttonType.digit;
    if (this.currentText == Calculator.EMPTY_TEXT) {
        this.currentText = digit;
    } else {
        this.currentText += digit;
    }
};

Calculator.appendDecimalPoint = function() {
    this.lastButtonType = Calculator.buttonType.digit;
    if (this.currentText.includes(".")) {
        this.errorState = true;
    } else {
        this.currentText += ".";
    }
};

Calculator.setBinaryOperator = function(operatorName) {
    this.lastButtonType = Calculator.buttonType.operator;
    this.operator = operatorName;
    this.previousNumber = this.currentNumber;
    this.currentNumber = 0;
};

Calculator.evaluate = function() {
    if (this.operator) {
        result = this.operate(
            this.operator, this.previousNumber, this.currentNumber);
        this.currentNumber = result;
    }
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

Calculator.operate = function(operator, a, b) {
    const functionName = this.getFunctionNameForOperator(operator);
    return Calculator[functionName](a, b);
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

//-----------------------------------------------------------------------------
// Helper functions
//-----------------------------------------------------------------------------

Calculator.getFunctionNameForOperator = function(op) {
    op = op.toLowerCase();
    if (op == "+" || op == "plus" || op.startsWith("add")) {
        return "add";
    } else if (op == '-' || op == "minus" || op.startsWith("sub")) {
        return "subtract";
    } else if (op == "*" || op == "x" || op == "times" || op.startsWith("mult")) {
        return "multiply";
    } else if (op == "/" || op.startsWith("div")) {
        return "divide";
    }
    throw new Error(`Unrecognized operator: ${op}`);
};
