const readline = require("readline");

function ParserChecker(s) {
  let stack = [];
  const pairs = { "{": "}", "(": ")", "[": "]" };

  for (const char of s) {
    //(LastIn - FirstOut)
    if (pairs[char]) {
      stack.push(char);
    } else {
      const last = stack.pop();
      if (!last || pairs[last] !== char) return false;
    }
  }
  return stack.length === 0;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter a string of brackets: ", (input) => {
  console.log(ParserChecker(input));
  rl.close();
});
