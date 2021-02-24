const fs = require('fs');
const { quickSort } = require('./algorithms/quickSort');

const { printOutput, processInputFile } = require('./utils');
// GLOBAL VARIABLES
let solutionData = [];

// SOLUTION
/**
 * Find the solution - 02
 * - based on max score
 */
const resolveTheProblem =  () => {
  console.log('Going to resolve the problem');
  solutionData = ['a','b','c'];
}


// PROCCESS INPUT FILE
let inputLineIndex = 0;

/**
 * Process a data line
 * @param {String} line content of a line data
 */
const lineProcessFct = (line) => {
  console.log('Process line ...', line);
  const array = line.split(' ');
  if (inputLineIndex === 0) {
    // This is the first line
    console.log('This is the first line: ', line);
  } else {
    console.log('This is not the first line: ', inputLineIndex, line);
  }
  inputLineIndex++;
}

/**
 * Process at the end of the input file
 */
const endProcessFct = () => {
  console.log('Finish reading input file: ', inputLineIndex);
  // quickSort(allLibraries, false, "signupTime");
  resolveTheProblem();
  printOutput(outputPath, solutionData);
}

// START APPLICATION
if (process.argv.length < 3) {
  console.error('MISSING ARGUMENT!');
  process.exit(1);
}
// Parse arguments
// CONFIG INTPUT and OUTPUT
const dataPath = process.argv[2];
const inputArrayPaths = dataPath.split('/');
const outputPath = `${inputArrayPaths[inputArrayPaths.length - 1]}_${Date.now()}.txt`;
console.log('Input data: ', dataPath);
console.log('Output will be: ', outputPath);
processInputFile(dataPath, lineProcessFct, endProcessFct);
