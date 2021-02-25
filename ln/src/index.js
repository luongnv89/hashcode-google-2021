const fs = require('fs');
const { quickSort } = require('./algorithms/quickSort');
const sort = require('fast-sort');
const { printOutput, processInputFile } = require('./utils');

class Pizza {
  constructor(id, line) {
    const array = line.split(' ');
    this.id = id;
    this.nbIngredients = Number(array[0]);
    this.isSelected = false;
    array.splice(0,1);
    this.ingredients = array;
  }

  selected() {
    this.isSelected = true;
  }
}

const getNewScores = (array1, array2) => {
  // console.log('getNewScore: ', array1, array2);
  let newScore = 0;
  let newElements = [];
  if (array2.length > 0) {
    if (array1.length === 0 ) {
      newScore = array2.length;
      newElements = array2;
    }else {
      array2.map(ing => {
        if (array1.indexOf(ing) === -1) {
          newScore++;
          newElements.push(ing);
        }
      });
    }
  }
  // console.log('getNewScore: ',newScore, newElements);
  return {
    newScore,
    newElements
  }
}

class Team {
  constructor(id, nbMembers) {
    this.id = id;
    this.nbMembers = nbMembers;
    this.nbDeliveredPizzas = 0;
    this.deliveredPizzas = [];
    this.allIngredients = [];
  }

  isCompleted() {
    return this.nbDeliveredPizzas === this.nbMembers;
  }

  getScore() {
    return this.allIngredients.length;
  }

  tryToDeliverPizza(pizza) {
    // console.log('Trying to deliver a pizza');
    // console.log(pizza);
    // console.log(this.allIngredients);
    if (!(pizza instanceof Pizza)) {
      console.error(`Not a pizza: ${JSON.stringify(pizza)}`);
      return {
        newScore: -1,
        newElements: []
      };
    }
    if (this.isCompleted()) {
      console.error(`Team ${this.id} is completed!`);
      return {
        newScore: -1,
        newElements: []
      };
    }
    return getNewScores(this.allIngredients, pizza.ingredients);
  }

  deliverPizza(pizza) {
    this.nbDeliveredPizzas++;
    pizza.selected();
    this.deliveredPizzas.push(pizza);
    pizza.ingredients.map(ing => {
      if (this.allIngredients.indexOf(ing) === -1) {
        this.allIngredients.push(ing);
      }
    })
    if (this.isCompleted()){
      solutionData.push(this);
    }
    console.log(`Delivered pizza ${pizza.id} to the team ${this.id}`);
  }
}

// GLOBAL VARIABLES
let solutionData = [];
let M = 0; // nb of pizzas
let T2 = 0; // nb of 2 person teams
let T3 = 0; // nb of 3 person teams
let T4 = 0; // nb of 4 person teams
let pizzas = []; // list of pizzas
let teams = []; // list of teams

// SOLUTION

const resolveTheProblemSequentlyAddedPizza =  () => {
  console.log('Going to resolve the problem');
  for (let index = 0; index < teams.length; index++) {
    const currentTeam = teams[index];
    while (!currentTeam.isCompleted()) {
      if(pizzas.length === 0) break;
      currentTeam.deliverPizza(pizzas[0]);
      pizzas.splice(0,1);
    }
  }
}

const resolveTheProblem =  () => {
  console.log('Going to resolve the problem');
  for (let index = 0; index < teams.length; index++) {
    const currentTeam = teams[index];
    while (!currentTeam.isCompleted()) {
      if(pizzas.length === 0) break;
      // select the best pizza to deliver
      let potentialPizzaIndex = 0;
      let newScoreMax = 0;
      let newElementsMax = [];
      for (let pIndex = 0; pIndex < pizzas.length; pIndex++) {
        const p = pizzas[pIndex];
        const {newScore, newElements} = currentTeam.tryToDeliverPizza(p);
        if (newScore > newScoreMax) {
          newScoreMax = newScore;
          potentialPizzaIndex = pIndex;
          newElementsMax = newElements;
        }
      }
      if (newScoreMax >= 0) {
        currentTeam.deliverPizza(pizzas[potentialPizzaIndex]);
        pizzas.splice(potentialPizzaIndex,1);
      }
    }
  }
}


// PROCCESS INPUT FILE
let inputLineIndex = 0;
/**
 * Process a data line
 * @param {String} line content of a line data
 */
const lineProcessFct = (line) => {
  console.log('Process line ...', line);

  if (inputLineIndex !== 0) {
    pizzas.push(new Pizza(inputLineIndex - 1, line));
  } else {
    // This is the first line
    const array = line.split(' ');
    console.log('This is the first line: ', line);
    M = array[0];
    let nbTeams = 0;
    T2 = array[1];
    for (let index = 0; index < T2; index++) {
      teams.push(new Team(nbTeams, 2));
      nbTeams++;
    }
    T3 = array[2];
    for (let index = 0; index < T3; index++) {
      teams.push(new Team(nbTeams, 3));
      nbTeams++;
    }
    T4 = array[3];
    for (let index = 0; index < T4; index++) {
      teams.push(new Team(nbTeams, 4));
      nbTeams++;
    }
  }
  inputLineIndex++;
}

/**
 * Process at the end of the input file
 */
const endProcessFct = () => {
  console.log('Finish reading input file: ', inputLineIndex);
  console.log(M, T2, T3, T4);
  console.log(pizzas);
  console.log(teams);
  // quickSort(allLibraries, false, "signupTime");
  sort(pizzas).desc('nbIngredients');
  resolveTheProblemSequentlyAddedPizza();
  console.log(pizzas);
  console.log(teams);
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
