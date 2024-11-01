//=============================================================================
// Calculator
// by McKathlin
//=============================================================================

const Calculator = {};

//=============================================================================
// UI Setup
//=============================================================================

Calculator.screenInput = document.querySelector("input#screen");
console.log(Calculator.screenNode);

document.querySelector("button#evaluate").addEventListener("click", (e) => {
    console.log("Evaluate");
    const expression = Calculator.screenInput.value;
    const result = Calculator.evaluateExpression(expression);
    const resultText = Number.isNaN(result) ? "ERROR" : result.toString();
    Calculator.screenInput.value = resultText;
});

document.querySelector("button#clear").addEventListener("click", (e) => {
    console.log("Clear");
    Calculator.screenInput.value = "";
});

// TODO: Implement backspace button

// TODO: Implement number buttons

// TODO: Implement decimal point button

// TODO: Implement operator buttons

//=============================================================================
// Calculator Logic
//=============================================================================
// Public Controls
//-----------------------------------------------------------------------------

Calculator.evaluateExpression = function(expression) {
    // TODO: Implement
    return Number.NaN;
};

//-----------------------------------------------------------------------------
// Private Helper Methods
//-----------------------------------------------------------------------------


