//=============================================================================
// Calculator
// by McKathlin
//=============================================================================

const Calculator = {};

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

Calculator.EMPTY_TEXT = "0";
Calculator.ERROR_TEXT = "ERROR";

Calculator.state = {
    error: -1,
    normal: 0,
    postOp: 1,
    postSquare: 2,
    postSquareRoot: 3
};

//-----------------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------------

Calculator.previousNumber = null;

Calculator._currentText = "";
Calculator._currentState = Calculator.state.normal;

//-----------------------------------------------------------------------------
// Properties
//-----------------------------------------------------------------------------

Object.defineProperties(Calculator, {
    currentNumber: {
        get: function() {
            if (this.currentState == Calculator.state.postOp) {
                return null;
            } else {
                return Number.parseFloat(this.currentText);
            }
        },
        set: function(value) {
            value = value ?? 0;
            if (Number.isNaN(value)) {
                this.currentState = Calculator.state.error;
            }
            this.currentText = value.toString();
        }
    },
    currentState: {
        get: function() {
            return this._currentState;
        },
        set: function(value) {
            if (this._currentState !== value) {
                this._currentState = value;
                this.updateUI();
            }
        }
    },
    currentText: {
        get: function() {
            if (this.currentState == Calculator.state.error) {
                return this.ERROR_TEXT;
            } else if (this.currentState == Calculator.state.postOp) {
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
    if (this.currentState == Calculator.state.error) {
        // Don't change error state.
    } else if (this.currentText == Calculator.EMPTY_TEXT) {
        // Already empty. Do nothing.
    } else if (this.currentState == Calculator.state.postOp) {
        // Undo operator selection.
        this.operateFunction = null;
        this.currentState = Calculator.state.normal;
    } else {
        // Remove the last character.
        Calculator.currentState = Calculator.state.normal;
        this.currentText = Calculator.currentText.slice(0, -1);
        if (this.currentText == "") {
            this.currentText = Calculator.EMPTY_TEXT;
        }
    }
};

Calculator.clear = function() {
    this.currentState = Calculator.state.normal;
    this.previousOperand = null;
    this.operateFunction = null;
    this.currentText = Calculator.EMPTY_TEXT;
    this.currentState = Calculator.state.normal;
};

Calculator.appendDigit = function(digit) {
    this.currentState = Calculator.state.normal;
    if (this.currentText == Calculator.EMPTY_TEXT) {
        this.currentText = digit;
    } else {
        this.currentText += digit;
    }
};

Calculator.appendDecimalPoint = function() {
    this.currentState = Calculator.state.normal;
    if (this.currentText.includes(".")) {
        this.currentState = Calculator.state.error;
    } else {
        this.currentText += ".";
    }
};

Calculator.setBinaryOperator = function(operatorName) {
    this.evaluate(); // Calculate previous operation, if any
    this.operator = operatorName;
    this.previousNumber = this.currentNumber;
    this.currentNumber = null;
    this.currentState = Calculator.state.postOp;
};

Calculator.evaluate = function() {
    if (this.previousNumber !== null && this.currentNumber !== null
    && this.operator !== null) {
        result = this.operate(
            this.operator, this.previousNumber, this.currentNumber);
        this.currentNumber = result;
    } else {
        this.currentNumber = this.currentNumber ?? this.previousNumber ?? 0;
    }
    this.previousNumber = null;
    this.currentState = Calculator.state.normal;
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
