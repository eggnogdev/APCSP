const VIEWBOX = document.getElementById("viewbox");
const NUMBERS = document.getElementsByClassName("number");
const OPERATORS = document.getElementsByClassName("operator");
const EQUAL = document.getElementById("equal");
const CLEAR = document.getElementById("clear");
const DELETE = document.getElementById("delete");

// find power operations in a string
const powerRegex = /\d+(\.\d+)?\^\d+(\.\d+)?/;

// find parenthetical operations in a string
const rightSideParenRegex = /\d+(\.\d+)?\(/;
const leftSideParenRegex = /\)\d+(\.\d+)?/;
const doubleParenRegex = /\)\(/;

// find multiplication with pi
const leftSidePiMult = /\(?\d+\)?π/;
const rightSidePiMult = /π\(?\d+\)?/;

// find square root
const sqrtRegex = /√\d+(\.\d+)?/;
// find square root mult
const leftSideSqrtMult = /\d+(\.\d+)?\)?√\d+(\.\d+)?/;

// find cube root
const cbrtRegex = /∛\d+(\.\d+)?/;
// find cube root mult
const leftSideCbrtMult = /\d+(\.\d+)?\)?∛\d+(\.\d+)?/;

// find sin, cos, tan, asin, acos, atan functions
const sinRegex = /sin\(\d+(\.\d+)?\)/;
const cosRegex = /cos\(\d+(\.\d+)?\)/;
const tanRegex = /tan\(\d+(\.\d+)?\)/;
const aSinRegex = /asin\(\d+(\.\d+)?\)/;
const aCosRegex = /acos\(\d+(\.\d+)?\)/;
const aTanRegex = /atan\(\d+(\.\d+)?\)/;

// find multiplication of trig functions
const leftSideSinMult = /\d+(\.\d+)?sin\(\d+(\.\d+)?\)/;
const leftSideCosMult = /\d+(\.\d+)?cos\(\d+(\.\d+)?\)/;
const leftSideTanMult = /\d+(\.\d+)?tan\(\d+(\.\d+)?\)/;
const leftSideASinMult = /\d+(\.\d+)?asin\(\d+(\.\d+)?\)/;
const leftSideACosMult = /\d+(\.\d+)?acos\(\d+(\.\d+)?\)/;
const leftSideATanMult = /\d+(\.\d+)?atan\(\d+(\.\d+)?\)/;

// operators
const opsRegex = /\+|\-|\/|\*|\^/;

// find operations in parethesis
const parenOps = /\(\d+(\.\d+)?(\+|\-|\/|\*|\^)\d+(\.\d+)?\)/;

// find e
const leftSideEMult = /\d+(\.\d+)?e/;
const rightSideEMult = /e\d+(\.\d+)?/;

/**
 * To display something to the calculator viewbox
 * @param {string} value - the value to display to the viewbox
 */
function display(value) {
  let temp = VIEWBOX.textContent;
  temp += value;
  VIEWBOX.textContent = temp;
  VIEWBOX.scrollLeft = VIEWBOX.scrollWidth;
}

/**
 * To run whenever a number is pressed/typed
 * @param {number} index - index of the button in the array {NUMBERS}
 */
function numberListener(index) {
  display(NUMBERS[index].value);
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

/**
 * To run whenever an operator is pressed/typed
 * @param {number} index - index of the button in the array {OPERATORS}
 */
function operatorListener(index) {
  if (["sin", "cos", "tan", "asin", "acos", "atan"].includes(OPERATORS[index].value)) {
    display(`${OPERATORS[index].value}(`);
  } else {
    display(OPERATORS[index].value);
  }
}

/**
 * To run whenever the clear button is pressed
 */
function clearListener() {
  VIEWBOX.textContent = "";
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

/**
 * To run whenever the delete button is pressed
 */
function deleteListener() {
  VIEWBOX.textContent = VIEWBOX.textContent.substring(0, VIEWBOX.textContent.length - 1);
  VIEWBOX.scrollLeft = VIEWBOX.scrollWidth;
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

/**
 * Execute all operations of a trig function in a string
 * @param {string} temp - the string to look through, change, and return
 * @param {RegExp} trigRegex - the regular expression pattern to look for
 * @param {string} trigFunc - the trig function to be executed
 * @returns {string} - the result of the trig operation swapped with the matched pattern in the string {temp}
 */
function doTrig(temp, trigRegex, trigFunc) {
  let match;
  do {
    match = temp.match(trigRegex);
    if (match) {
      let num = match[0].replace(`${trigFunc}(`, "");
      num = num.replace(")", "");
      if (num.includes(".")) num = parseFloat(num);
      else num = parseInt(num);
      switch (trigFunc) {
        case "sin":
          temp = temp.replace(match[0], Math.sin(num));
          break;
        case "cos":
          temp = temp.replace(match[0], Math.cos(num));
          break;
        case "tan":
          temp = temp.replace(match[0], Math.tan(num));
          break;
        case "asin":
          temp = temp.replace(match[0], Math.asin(num));
          break;
        case "acos":
          temp = temp.replace(match[0], Math.acos(num));
          break;
        case "atan":
          temp = temp.replace(match[0], Math.atan(num));
          break;
      }
    }
  } while (match);
  return temp;
}

/**
 * Make it possible to multiply trig operations by putting a number next to it IE: 2sin(1)
 * @param {string} temp - the string to look through, change, and return
 * @param {RegExp} trigRegex - the regular expression pattern to look for
 * @param {string} trigFunc - the trig function to be executed
 * @returns {string} - the updated {temp} with a * next to the {trigFunc} to
 *                     make it multipliable with the number next to it
 */
function multTrig(temp, trigRegex, trigFunc) {
  let match;
  do {
    match = temp.match(trigRegex);
    if (match) {
      let num = match[0].split(trigFunc);
      num = num.join(`*${trigFunc}`);
      temp = temp.replace(match[0], num);
    }
  } while (match);

  return temp;
}

/**
 * To run whenever the equal/enter button is pressed/typed
 */
function equalListener() {
  let match;
  let temp = VIEWBOX.textContent.replace("x", "*");
  temp = temp.replace("÷", "/");

  // In order to execute operations with Euler's number
  do {
    match = temp.match(leftSideEMult);
    if (match) {
      let copy = match[0];
      copy = copy.split("e");
      copy = copy.join("*e");
      temp = temp.replace(match[0], copy);
    }
  } while (match);

  do {
    match = temp.match(rightSideEMult);
    if (match) {
      let copy = match[0];
      copy = copy.split("e");
      copy = copy.join("e*");
      temp = temp.replace(match[0], copy);
    }
  } while (match);

  if (temp.includes("e")) temp = temp.replaceAll("e", `${Math.E}`);

  // In order to execute pi multiplication
  do {
    match = temp.match(leftSidePiMult);
    if (match) {
      let nums = match[0].split("π");
      nums = nums.join("*π");
      temp = temp.replace(match[0], nums);
    }
  } while (match);
  do {
    match = temp.match(rightSidePiMult);
    if (match) {
      let nums = match[0].split("π");
      nums = nums.join("π*");
      temp = temp.replace(match[0], nums);
    }
  } while (match);

  if (temp.includes("π")) temp = temp.replaceAll("π", `${Math.PI}`);

  // In order to execute operations within parentheses
  do {
    match = temp.match(parenOps);
    if (match) {
      let op = match[0].match(opsRegex)[0];
      let nums = match[0].split(op);
      let num1 = nums[0].replace("(", "");
      let num2 = nums[1].replace(")", "");
      if (num1.includes(".")) num1 = parseFloat(num1);
      else num1 = parseInt(num1);

      if (num2.includes(".")) num2 = parseFloat(num2);
      else num2 = parseInt(num2);

      temp = temp.replace(match[0], `(${doOperation(num1, op, num2)})`);
    }
  } while (match);

  // In order to execute power operations
  do {
    match = temp.match(powerRegex);
    if (match) {
      match = match[0];
      let nums = match.split("^");

      // parseInt/Float the base
      if (nums[0].includes(".")) nums[0] = parseFloat(nums[0]);
      else nums[0] = parseInt(nums[0]);

      // parseInt/Float the exponent
      if (nums[1].includes(".")) nums[1] = parseFloat(nums[1]);
      else nums[1] = parseInt(nums[1]);

      temp = temp.replace(match, `Math.pow(${nums[0]}, ${nums[1]})`);
    }
  } while (match);

  // In order to execute parethetical multiplication
  do {
    match = temp.match(rightSideParenRegex);
    if (match) {
      let nums = match[0].split("(");
      nums = nums.join("*(");
      temp = temp.replace(match[0], nums);
    }
  } while (match);
  do {
    match = temp.match(leftSideParenRegex);
    if (match) {
      let nums = match[0].split(")");
      nums = nums.join(")*");
      temp = temp.replace(match[0], nums);
    }
  } while (match);
  do {
    match = temp.match(doubleParenRegex);
    if (match) {
      let nums = match[0].split(")(");
      nums = nums.join(")*(");
      temp = temp.replace(match[0], nums);
    }
  } while (match);

  // In order to execute square root
  do {
    match = temp.match(leftSideSqrtMult);
    if (match) {
      let nums = match[0].split("√");
      nums = nums.join("*√");
      temp = temp.replace(match[0], nums);
    }
  } while (match);
  do {
    match = temp.match(sqrtRegex);
    if (match) {
      let num = match[0].replace("√", "");
      if (num.includes(".")) num = parseFloat(num);
      else num[0] = parseInt(num);
      temp = temp.replace(match[0], Math.sqrt(num));
    }
  } while (match);

  // In order to execute cube root
  do {
    match = temp.match(leftSideCbrtMult);
    if (match) {
      let nums = match[0].split("∛");
      nums = nums.join("*∛");
      temp = temp.replace(match[0], nums);
    }
  } while (match);
  do {
    match = temp.match(cbrtRegex);
    if (match) {
      let num = match[0].replace("∛", "");
      if (num.includes(".")) num = parseFloat(num);
      else num[0] = parseInt(num);
      temp = temp.replace(match[0], Math.cbrt(num));
    }
  } while (match);

  // In order to execute sine, cosine, tangent, arcsine, arccosine, arctangent
  const trigs = ["asin", "acos", "atan", "sin", "cos", "tan"];
  const trigRegexs = [aSinRegex, aCosRegex, aTanRegex, sinRegex, cosRegex, tanRegex];
  const multTrigRegexs = [
    leftSideASinMult,
    leftSideACosMult,
    leftSideATanMult,
    leftSideSinMult,
    leftSideCosMult,
    leftSideTanMult,
  ];
  for (let i = 0; i < trigRegexs.length; i++) {
    temp = multTrig(temp, multTrigRegexs[i], trigs[i]);
    temp = doTrig(temp, trigRegexs[i], trigs[i]);
  }

  try {
    VIEWBOX.textContent = eval(temp);
  } catch (e) {
    VIEWBOX.textContent = "SyntaxError";
  }
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

/**
 * To add the on click listeners to every element in {NUMBERS}
 */
function addNumberListeners() {
  for (let i = 0; i < NUMBERS.length; i++) {
    NUMBERS[i].addEventListener("click", () => {
      numberListener(i);
    });
  }
}

/**
 * To add the on click listeners to every element in {OPERATORS}
 */
function addOperatorListeners() {
  for (let i = 0; i < OPERATORS.length; i++) {
    OPERATORS[i].addEventListener("click", () => {
      operatorListener(i);
    });
  }
}

/**
 * To execute the basic operation between two numbers and an operator
 * @param {number} num1 - any number
 * @param {string} op - any operator (+, -, /, *, ^)
 * @param {number} num2 - any number
 * @returns {string} - result of the operation
 */
function doOperation(num1, op, num2) {
  let res;
  switch (op) {
    case "+":
      res = num1 + num2;
      break;
    case "-":
      res = num1 - num2;
      break;
    case "*":
      res = num1 * num2;
      break;
    case "/":
      res = num1 / num2;
      break;
    case "^":
      res = Math.pow(num1, num2);
      break;
  }
  return res.toString();
}

/**
 * Count how many times a character appears in a string
 * @param {string} str - any string
 * @param {string} char - a single character
 * @returns {number} - number of times {char} appears in {str}
 */
function countChars(str, char) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === char) count++;
  }
  return count;
}

addNumberListeners();
addOperatorListeners();

/**
 * To run whenever the user types
 */
document.addEventListener("keydown", (event) => {
  let key = event.key;

  // allow user to type for multiply and divide
  switch (key) {
    case "/":
      key = "÷";
      break;
    case "*":
      key = "x";
      break;
    case "p":
      key = "π";
      break;
  }

  // all the different possible keys a user is allowed to type
  let numberValues = [];
  let operatorValues = [];

  for (let i = 0; i < NUMBERS.length; i++) numberValues.push(NUMBERS[i].value);
  for (let i = 0; i < OPERATORS.length; i++) operatorValues.push(OPERATORS[i].value);

  if (numberValues.includes(key)) return numberListener(numberValues.indexOf(key));
  else if (operatorValues.includes(key)) return operatorListener(operatorValues.indexOf(key));
  else if (key === "Enter") return equalListener();
  else if (key === "Backspace") return deleteListener();
  else if (key === "Escape") return clearListener();
  else return;
});

CLEAR.addEventListener("click", clearListener);

DELETE.addEventListener("click", deleteListener);

EQUAL.addEventListener("click", equalListener);
