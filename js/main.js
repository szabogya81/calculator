'use strict';

const display = document.querySelector('.container__display');
const clearButton = document.querySelector('.operand--clear');
const calculateButton = document.querySelector('.calculate');
const operandButtons = document.querySelectorAll('.operand');
const operatorButtons = document.querySelectorAll('.operator');
const singFloatButton = document.querySelector('.operand--float');
const operators = [];
const operands = [];

let currentOperand = [];
let previousIsOperand = false;

clearButton.addEventListener('click', initCalculator);
calculateButton.addEventListener('click', showResult);
operandButtons.forEach(button => button.addEventListener('click', handleOperand));
operatorButtons.forEach(button => button.addEventListener('click', handleOperator));

clearButton.addEventListener('keypress', handleKeyPress);
calculateButton.addEventListener('keypress', handleKeyPress);
operandButtons.forEach(button => button.addEventListener('keypress', handleKeyPress));
operatorButtons.forEach(button => button.addEventListener('keypress', handleKeyPress));

function initCalculator() {
    display.value = '';
    display.classList.remove('container__display--long');
    resetOperationVariables(false);
    disableButtons(true, true, false);
}

function showResult() {
    if(operators.length > 0 && operands.length === operators.length + 1) {
        setResult(calculateResult());
        setDisplay();
    }
    else {
        initCalculator();
        handleError();
    }  
}

function resetOperationVariables(previousIsOperandValue) {
    operators.splice(0, operators.length);
    operands.splice(0, operands.length);
    currentOperand = [];
    previousIsOperand = previousIsOperandValue;
}

function calculateResult() {
    let result = parseOperand(operands[0]);
    for(let i = 0; i < operators.length; i++) {
        result = calculateSubResult(result, parseOperand(operands[i + 1]), operators[i])
    }
    return result;
}

function calculateSubResult(subValue, nextValue, operator) {
    if(operator === '+') {
        return addNumbers(subValue, nextValue);
    } else if(operator === '-') {
        return subtractNumbers(subValue, nextValue);
    }  else if(operator === '*') {
        return multiplyNumbers(subValue, nextValue);
    }  else if(operator === '/') {
        return divideNumbers(subValue, nextValue);
    }
}

const parseOperand = (operand) => operand.includes('.') ? parseFloat(operand) : parseInt(operand);
const addNumbers = (x, y) =>  x + y;
const subtractNumbers = (x, y) => x - y;
const multiplyNumbers = (x, y) => x * y;
const divideNumbers = (x, y) => x / y;

function setResult(result) {
    if(isNaN(result) || result === Infinity || result === -Infinity) {
        handleError();
    } else {
        display.value = result;
        resetOperationVariables(true);
        operands.push(result.toString());
        disableButtons(true, false, true);
    }
}

function handleError() {
    display.value = 'ERROR'
    disableButtons(true, true, true);
}

function disableButtons(calculate, operator, operand) {
    calculateButton.disabled = calculate;
    operatorButtons.forEach(operatorButton => operatorButton.disabled = operator);
    operandButtons.forEach(operandButton => operandButton.disabled = operand);
    singFloatButton.disabled = true;
}

function handleOperand(e) {
    currentOperand.push(e.currentTarget.value);
    fillOperands();
    previousIsOperand = true;
    updateCalculator(e);
    singFloatButton.disabled = currentOperand.includes('.');
    handleCalculateButton();
}

function handleOperator(e) {
    currentOperand = [];
    operators.push(e.currentTarget.value);
    previousIsOperand = false;
    updateCalculator(e, true);
    handleCalculateButton();
}

function handleKeyPress(e) {
    if(e.keyCode == 13) {
        e.preventDefault();
        if(e.currentTarget.classList.contains('operand')) {
            handleOperand(e);
        } else if(e.currentTarget.classList.contains('operator')) {
            handleOperator(e);
        } else if(e.currentTarget.classList.contains('operand--clear')) {
            initCalculator();
        } else if(e.currentTarget.classList.contains('calculate')) {
            showResult();
        }
    }
}

function fillOperands() {
    if(previousIsOperand) {
        operands[operands.length -1] = currentOperand.join('');
    } else {
        operands.push(currentOperand.join(''));
    }
}

function updateCalculator(e, isOperator = false) {
    display.value += e.currentTarget.value.replace('*', 'x').replace('/', '÷');
    setDisplay();
    setButtons(e, isOperator);
}

function setDisplay() {
    if(display.value.length > 40) {
        display.classList.add('container__display--long');
    } else {
        display.classList.remove('container__display--long');
    }
}

function setButtons(e, isOperator = false) {
    operatorButtons.forEach(operatorButton => 
        operatorButton.disabled = !previousIsOperand ||  e.currentTarget.value === '.');
    operandButtons.forEach(operandButton => 
        operandButton.disabled = previousIsOperand && isOperator);
    singFloatButton.disabled = isOperator;
}

function handleCalculateButton() {
    calculateButton.disabled =  
        !previousIsOperand ||
        !operands.length % 2 
        || operands.length < 2
        || operators.length !== operands.length -1 
        || operands.join('').endsWith('.')
}