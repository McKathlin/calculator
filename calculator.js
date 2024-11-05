//=============================================================================
// Calculator
// by McKathlin
//=============================================================================

const Calculator = {};

//=============================================================================
// UI Setup
//=============================================================================
// Node Handles
//-----------------------------------------------------------------------------

Calculator.resultNode = document.querySelector("#result");

// Unique buttons
Calculator.backspaceButton = document.querySelector("button#backspace");
Calculator.clearButton = document.querySelector("button#clear");
Calculator.decimalPointButton = document.querySelector("button#decimal-point");
Calculator.equalsButton = document.querySelector("button#equals");

// Button groups
Calculator.unaryOperatorButtons = document.querySelectorAll("button.unary");
Calculator.operatorButtons = document.querySelectorAll("button.operator");
Calculator.digitButtons = document.querySelectorAll("button.digit");

//-----------------------------------------------------------------------------
// Initialization
//-----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", (e) => {
    Calculator.clear();
});

//-----------------------------------------------------------------------------
// Click events
//-----------------------------------------------------------------------------

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
        const digit = e.target.innerText;
        Calculator.appendDigit(digit);
    });
}

for (let button of Calculator.operatorButtons) {
    button.addEventListener("click", (e) => {
        Calculator.setBinaryOperator(e.target.id);
    });
}

document.querySelector("button#square-root").addEventListener("click", (e) => {
    Calculator.applySquareRoot();
});

document.querySelector("button#square").addEventListener("click", (e) => {
    Calculator.applySquare();
});

//-----------------------------------------------------------------------------
// Keyboard
//-----------------------------------------------------------------------------

document.addEventListener("keydown", (e) => {
    console.log(e.key);
    const targetButton = Calculator.getButtonForKeyEvent(e);
    if (targetButton) {
        targetButton.classList.add("pressed");
    }
});

document.addEventListener("keyup", (e) => {
    const targetButton = Calculator.getButtonForKeyEvent(e);
    if (targetButton) {
        targetButton.dispatchEvent(new Event("click"));
        targetButton.classList.remove("pressed");
    }
});

Calculator.getButtonForKeyEvent = function(event) {
    const key = event.key.toLowerCase();
    if (/^[0-9]$/.test(key)) {
        return document.querySelector(`#num-${key}`);
    }
    
    switch(key) {
        case "=":
        case "enter":
            return Calculator.equalsButton;
        case "c":
        case "home":
            return Calculator.clearButton;
        case "+":
            return document.querySelector("#plus");
        case "-":
            return document.querySelector("#minus");
        case "x":
        case "*":
            return document.querySelector("#times");
        case "/":
            return document.querySelector("#divide");
        case ".":
            return Calculator.decimalPointButton;
        case "backspace":
        case "delete":
            return Calculator.backspaceButton;
        case "pageup":
            return document.querySelector("#square");
        case "pagedown":
            return document.querySelector("#square-root");
    }

    // No matching button found.
    return null;
};

//=============================================================================
// UI Update
//=============================================================================

Calculator.updateUI = function() {
    this.resultNode.innerText =
        this.currentText ?? this.previousText ?? this.EMPTY_TEXT;
    
    // TODO: Enable/disable buttons as needed
};

//=============================================================================
// Calculator Logic
//=============================================================================
// Constants
//-----------------------------------------------------------------------------

Calculator.EMPTY_TEXT = "0";
Calculator.ERROR_TEXT = "ERROR";
Calculator.OVERFLOW_TEXT = "OVERFLOW";
Calculator.CONFUSED_TEXT = "WHAT";
Calculator.INFINITY_TEXT = "NOPE";
Calculator.MAX_OUTPUT_LENGTH = 12;
Calculator.ELLIPSIS = "\u{2026}";

Calculator.state = {
    error: -1,
    normal: 0,
    postOp: 1,
    postEval: 2,
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
            if (this.currentText == null) {
                return null;
            } else {
                return Number.parseFloat(this.currentText);
            }
        },
        set: function(value) {
            if (null == value) {
                this.currentText = null;
            } else if (Number.isNaN(value)) {
                this.currentState = Calculator.state.error;
                this.currentText = Calculator.ERROR_TEXT;
            } else if (!Number.isFinite(value)) {
                this.currentState = Calculator.state.error;
                this.currentText = Calculator.INFINITY_TEXT;
            } else {
                let text = value.toString();
                if (text.toLowerCase().includes("e")) {
                    // This calculator does not support E notation.
                    this.currentState = Calculator.state.error;
                    this.currentText = Calculator.ERROR_TEXT;
                } else {
                    this.currentText = text;
                }
            }
        }
    },
    currentState: {
        get: function() {
            return this._currentState;
        },
        set: function(value) {
            if (this._currentState == Calculator.state.error) {
                // Can't leave an error state using this setter.
            } else if (this._currentState !== value) {
                this._currentState = value;
            }
        }
    },
    currentText: {
        get: function() {
            return this._currentText;
        },
        set: function(value) {
            if (value == this._currentText) {
                return; // No change.
            } else if (value === null) {
                // This will make the display fall through to previous text
                this._currentText = null;
            } else if (value === "") {
                this._currentText = this.EMPTY_TEXT;
            } else if (value.length > this.MAX_OUTPUT_LENGTH) {
                const ellipsisBufferLength = this.MAX_OUTPUT_LENGTH - 2;
                let preDecimalLength = value.indexOf('.');
                if (preDecimalLength < 0) {
                    preDecimalLength = value.length;
                }
                if (preDecimalLength >= ellipsisBufferLength) {
                    this.currentState = Calculator.state.error;
                    this._currentText = Calculator.OVERFLOW_TEXT;
                } else {
                    this._currentText = value.slice(
                        0, this.MAX_OUTPUT_LENGTH - 1) + this.ELLIPSIS;
                }
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
    },
    previousText: {
        get: function() {
            return this.previousNumber === null ?
                null : this.previousNumber.toString();
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
    this._currentState = Calculator.state.postEval;
    this.previousNumber = null;
    this.operateFunction = null;
    this.currentText = Calculator.EMPTY_TEXT;
};

Calculator.appendDigit = function(digit) {
    if (this.currentState == Calculator.state.error) {
        this.clear(); // Start fresh
    } else if (this.currentState == Calculator.state.postOp
    || this.currentState == Calculator.state.postEval) {
        this.currentText = null; // Prepare to take a new number
    }
    this.currentState = Calculator.state.normal;
    if (!this.currentText || this.currentText == Calculator.EMPTY_TEXT) {
        this.currentText = digit;
    } else {
        this.currentText += digit;
    }
};

Calculator.appendDecimalPoint = function() {
    if (this.currentState == Calculator.state.error) {
        // Can't append during an error
    } else if (this.currentText.includes(".")) {
        this.currentState = Calculator.state.error;
        this.currentText = Calculator.ERROR_TEXT;
    } else {
        this.currentState = Calculator.state.normal;
        this.currentText += ".";
    }
};

Calculator.appendNegativeSign = function() {
    this.currentState = Calculator.state.normal;
    if (!this.currentText || this.currentText == Calculator.EMPTY_TEXT) {
        // Start a negative number.
        this.currentText = "-";
    } else if (this.currentText.startsWith("-")) {
        // Take away the negative sign to invert the negative.
        this.currentText = this.currentText.slice(1);
    } else {
        // Make it negative.
        this.currentText = "-" + this.currentText;
    }
}

Calculator.setBinaryOperator = function(operatorName) {
    if (this.currentState == Calculator.state.error) {
        // Can't operate during an error
        return;
    }
    
    // Standardize the operator name for checks.
    operatorName = Calculator.getFunctionNameForOperator(operatorName);
    if (this.currentState == Calculator.state.postOp) {
        // Setting an operator right after an operator is unusual.
        // Check what it means.
        if (operatorName == "subtract") {
            Calculator.appendNegativeSign();
        } else if (operatorName == "add") {
            // This affirms that the number to follow is positive,
            // but that's already the default.
            // Do nothing.
        } else {
            // A multiply or divide after another operator makes no sense.
            this.currentState = Calculator.state.error;
            this.currentText = Calculator.CONFUSED_TEXT;
        }
        return;
    } else if (this.currentText == 0 || this.currentText == Calculator.EMPTY_TEXT
    && operatorName == "subtract") {
        Calculator.appendNegativeSign();
    }

    // Set the operator normally.
    this.evaluate(); // Calculate previous operation, if any
    this.operator = operatorName;
    this.previousNumber = this.currentNumber;
    this.currentNumber = null;
    this.currentState = Calculator.state.postOp;
    return;
};

Calculator.evaluate = function() {
    if (this.currentState == Calculator.state.error) {
        return; // Can't evaluate during an error
    }
    if (this.previousNumber !== null && this.currentNumber !== null
    && this.operator !== null) {
        result = this.operate(
            this.operator, this.previousNumber, this.currentNumber);
        this.currentNumber = result;
    } else {
        this.currentNumber = this.currentNumber ?? this.previousNumber ?? 0;
    }
    this.previousNumber = null;
    this.currentState = Calculator.state.postEval;
};

Calculator.applySquareRoot = function() {
    if (this.currentState == Calculator.state.error) {
        return; // Can't append during an error
    }
    this.currentNumber = this.squareRoot(this.currentNumber);
    this.currentState = Calculator.state.normal;
};

Calculator.applySquare = function() {
    if (this.currentState == Calculator.state.error) {
        return; // Can't append during an error
    }
    this.currentNumber = this.square(this.currentNumber);
    this.currentState = Calculator.state.normal;
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
    } else {
        return null; // No matching function found
    }
};
