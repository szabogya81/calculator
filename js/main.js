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

clearButton.addEventListener('click', clearInput);
calculateButton.addEventListener('click', calculateResult);
operandButtons.forEach(button => button.addEventListener('click', handleOperand));
operatorButtons.forEach(button => button.addEventListener('click', handleOperator));

clearButton.addEventListener('keypress', handleKeyPress);
calculateButton.addEventListener('keypress', calculateResult);
operandButtons.forEach(button => button.addEventListener('keypress', handleKeyPress));
operatorButtons.forEach(button => button.addEventListener('keypress', handleKeyPress));

function clearInput() {
    display.value = '';
    display.classList.remove('container__display--long');
    operators.splice(0, operators.length);
    operands.splice(0, operands.length);
    calculateButton.disabled = true;
    currentOperand = [];
    previousIsOperand = false;
    operatorButtons.forEach(operatorButton => operatorButton.disabled = true);
}

function calculateResult() {
    //TODO: implement calc logic and show result
}

function handleOperand(e) {
    currentOperand.push(e.currentTarget.value);
    fillOperands();
    previousIsOperand = true;
    singFloatButton.disabled = currentOperand.includes('.');
    updateCalculator(e);
    handleCalculateButton();
}

function handleOperator(e) {
    currentOperand = [];
    operators.push(e.currentTarget.value);
    previousIsOperand = false;
    updateCalculator(e);
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
            clearInput();
        } else if(e.currentTarget.classList.contains('calculate')) {
            calculateResult();
        }
    }
}

function fillOperands() {
    if(previousIsOperand) {
        operands[operands.length -1 ] = currentOperand.join('');
    } else {
        operands.push(currentOperand.join(''));
    }
}

function updateCalculator(e) {
    display.value += e.currentTarget.value.replace('*', 'x').replace('/', '÷');
    if(display.value.length > 40) {
        display.classList.add('container__display--long');
    }
    operatorButtons.forEach(operatorButton => 
        operatorButton.disabled = !previousIsOperand ||  e.currentTarget.value === '.');
}

function handleCalculateButton() {
    calculateButton.disabled =  
        !previousIsOperand ||
        !operands.length % 2 
        || operands.length < 2
        || operators.length !== operands.length -1 
        || operands.join('').endsWith('.')
}