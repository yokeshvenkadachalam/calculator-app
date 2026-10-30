
const display = document.getElementById("display");
const expression = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForOperand = false;
let justCalculated = false;

function updateDisplay() {
    display.value = currentValue;
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }

    if (Math.abs(number) >= 1e15) {
        return number.toExponential(6);
    }

    return String(Number(number.toPrecision(12)));
}

function clearCalculator() {
    currentValue = "0";
    previousValue = null;
    operator = null;
    waitingForOperand = false;
    justCalculated = false;

    expression.textContent = "";
    updateDisplay();
}

function inputDigit(digit) {
    if (currentValue === "Error") {
        clearCalculator();
    }

    if (waitingForOperand || justCalculated) {
        currentValue = digit;
        waitingForOperand = false;
        justCalculated = false;
    } else if (currentValue === "0") {
        currentValue = digit;
    } else if (currentValue === "-0") {
        currentValue = "-" + digit;
    } else if (currentValue.replace("-", "").replace(".", "").length < 15) {
        currentValue += digit;
    }

    updateDisplay();
}

function inputDecimal() {
    if (currentValue === "Error") {
        clearCalculator();
    }

    if (waitingForOperand || justCalculated) {
        currentValue = "0.";
        waitingForOperand = false;
        justCalculated = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;

        case "-":
            return a - b;

        case "*":
            return a * b;

        case "/":
            if (b === 0) {
                return null;
            }
            return a / b;

        default:
            return b;
    }
}

function showResult(result) {
    if (result === null || !Number.isFinite(result)) {
        currentValue = "Error";
        expression.textContent = "Cannot divide by zero";
        previousValue = null;
        operator = null;
        waitingForOperand = true;
        justCalculated = true;
    } else {
        currentValue = formatNumber(result);
        previousValue = null;
        operator = null;
        waitingForOperand = true;
        justCalculated = true;
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (currentValue === "Error") {
        clearCalculator();
        return;
    }

    const inputValue = Number(currentValue);

    if (operator && !waitingForOperand) {
        const result = calculate(previousValue, inputValue, operator);

        if (result === null || !Number.isFinite(result)) {
            showResult(null);
            return;
        }

        currentValue = formatNumber(result);
        previousValue = result;
        updateDisplay();
    } else {
        previousValue = inputValue;
    }

    operator = nextOperator;
    waitingForOperand = true;
    justCalculated = false;

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    expression.textContent =
        `${formatNumber(previousValue)} ${symbols[operator]}`;
}

function performCalculation() {
    if (operator === null || previousValue === null) {
        return;
    }

    const a = previousValue;
    const b = Number(currentValue);
    const op = operator;

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    expression.textContent =
        `${formatNumber(a)} ${symbols[op]} ${formatNumber(b)} =`;

    const result = calculate(a, b, op);

    showResult(result);
}

function applyPercent() {
    if (currentValue === "Error") {
        clearCalculator();
        return;
    }

    const value = Number(currentValue);

    // For a pending operation, interpret the percentage
    // relative to the first operand for + and -.
    let result = value / 100;

    if (previousValue !== null &&
        (operator === "+" || operator === "-")) {
        result = previousValue * value / 100;
    }

    currentValue = formatNumber(result);
    waitingForOperand = false;
    justCalculated = false;

    updateDisplay();
}

function toggleSign() {
    if (currentValue === "Error" || Number(currentValue) === 0) {
        return;
    }

    currentValue = currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;

    justCalculated = false;
    updateDisplay();
}

function deleteDigit() {
    if (currentValue === "Error" || justCalculated) {
        clearCalculator();
        return;
    }

    if (waitingForOperand) {
        return;
    }

    if (currentValue.length <= 1 ||
        (currentValue.length === 2 && currentValue.startsWith("-"))) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (value !== undefined) {
        if ("0123456789".includes(value) && value.length === 1) {
            inputDigit(value);
        } else {
            chooseOperator(value);
        }

        return;
    }

    switch (action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteDigit();
            break;

        case "decimal":
            inputDecimal();
            break;

        case "percent":
            applyPercent();
            break;

        case "sign":
            toggleSign();
            break;

        case "equals":
            performCalculation();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputDigit(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        performCalculation();
    } else if (key === "Backspace") {
        deleteDigit();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        applyPercent();
    }
});

updateDisplay();
