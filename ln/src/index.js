const fs = require("fs");
const { quickSort } = require("./algorithms/quickSort");
const sort = require("fast-sort");

const { printOutput, processInputFile } = require("./utils");

// Classes
class Street {
  constructor(id, name, start, end, long) {
    this.id = id;
    this.name = name;
    this.start = start;
    this.end = end;
    this.long = long;
    this.greenLightDuration = 0;
    this.enable = false;
    this.nbPassingCars = 0;
    this.nbStartedCars = 0;
    this.nbEndedCars = 0;
  }

  setGreenLightDuration(duration) {
    this.greenLightDuration = duration;
  }
}

class Car {
  constructor(id, nbStreets, totalTime, streets) {
    this.id = id;
    this.nbStreets = nbStreets;
    this.streets = streets;
    this.totalTime = totalTime;
  }
}

class Intersection {
  constructor(id) {
    this.id = id;
    this.inComingStreets = [];
    this.outGoingStreets = [];
    this.scheduleIncomingStreets = [];
  }
}

// GLOBAL VARIABLES
let allIntersections = [];
let allCars = [];
let allStreets = [];
let allStreetIndexes = {}; // quick query to the street
let inputLineIndex = 0;
let simulationTime = 0;
let nbIntersections = 0;
let nbStreets = 0;
let nbCars = 0;
let bonusPoint = 0;
let streetIndex = 0;
let carIndex = 0;
// let allUsedStreets = [];

// Clean data
///Filter data
/// - all the streets that does not have any car passing through
/// - all the car that has the time to reach the destination is longer than the simulation time
///

const cleanData = () => {
  console.log("unused car: ", nbCars, allCars.length);
  console.log(
    "unused streets: ",
    nbStreets,
    allStreets.filter((st) => st.enable === true).length
    // allUsedStreets.length
  );
  // console.log(allCars);
  // console.log(allStreets);
  // console.log(allStreetIndexes);
};

// SOLUTION

const resolveTheProblem2 = () => {
  console.log("Going to resolve the problem");
  // console.log(allIntersections);
  // console.log(allStreets);
  for (let index = 0; index < allIntersections.length; index++) {
    const currentIntersection = allIntersections[index];
    const { inComingStreets } = currentIntersection;
    // console.log('before: ',inComingStreets);
    sort(inComingStreets).desc("nbPassingCars");
    // console.log('after: ',inComingStreets);
    inComingStreets[0].setGreenLightDuration(simulationTime);
    currentIntersection.scheduleIncomingStreets.push(inComingStreets[0]);
    // for (
    //   let streetIndex = 0;
    //   streetIndex < inComingStreets.length;
    //   streetIndex++
    // ) {
    //   const currentStreet = inComingStreets[streetIndex];
    //   const duration = Math.ceil(simulationTime / inComingStreets.length);
    //   console.log(duration);
    //   // const duration = 1;
    //   if (duration > 0) {
    //     currentStreet.setGreenLightDuration(duration);
    //     currentIntersection.scheduleIncomingStreets.push(currentStreet);
    //   }
    // }
  }
};
/**
 * Find the solution - 02
 * - based on max score
 */
const resolveTheProblem = () => {
  console.log("Going to resolve the problem");
  // console.log(allIntersections);
  // console.log(allStreets);

  for (let index = 0; index < allIntersections.length; index++) {
    const currentIntersection = allIntersections[index];
    const { inComingStreets } = currentIntersection;
    const usedStreets = inComingStreets.filter((st) => st.enable === true);
    // console.log('before: ',inComingStreets);
    sort(usedStreets).asc("nbPassingCars");
    // console.log('after: ',inComingStreets);
    for (let streetIndex = 0; streetIndex < usedStreets.length; streetIndex++) {
      const currentStreet = usedStreets[streetIndex];
      // const duration = Math.ceil(simulationTime / inComingStreets.length);
      // console.log(duration);
      currentStreet.setGreenLightDuration(Math.floor(simulationTime / inComingStreets.length));
      currentIntersection.scheduleIncomingStreets.push(currentStreet);
    }
  }
};

// PROCCESS INPUT FILE
/**
 * Process a data line
 * @param {String} line content of a line data
 */
const lineProcessFct = (line) => {
  // console.log("Process line ...", line);
  const array = line.split(" ");
  if (inputLineIndex === 0) {
    // This is the first line
    // console.log("This is the first line: ", line);
    simulationTime = array[0];
    nbIntersections = array[1];
    // Init intersections
    for (let index = 0; index < nbIntersections; index++) {
      const intersection = new Intersection(index);
      allIntersections.push(intersection);
    }
    nbStreets = array[2];
    nbCars = array[3];
    bonusPoint = array[4];
  } else {
    // console.log('This is not the first line: ', inputLineIndex, line);
    if (streetIndex < nbStreets) {
      // this is a line to describe a street
      // console.log('street: ',streetIndex, line);
      const street = new Street(
        streetIndex,
        array[2],
        Number(array[0]),
        Number(array[1]),
        Number(array[3])
      );
      allStreetIndexes[array[2]] = street;
      allStreets.push(street);
      allIntersections[array[0]].outGoingStreets.push(street);
      allIntersections[array[1]].inComingStreets.push(street);
      streetIndex++;
    } else {
      // this is a line to describe a car
      // console.log('car: ', carIndex, line);
      const nbRues = Number(array[0]);
      array.splice(0, 1);
      // for (let index = 0; index < array.length; index++) {
      //   const st = array[index];
      //   if (allUsedStreets.indexOf(st) === -1) {
      //     allUsedStreets.push(st);
      //   }
      // }
      const streetArray = [];
      let totalTime = 0;
      for (let index2 = 0; index2 < array.length; index2++) {
        const st = array[index2];
        streetArray.push(allStreetIndexes[st]);
        allStreetIndexes[st].nbPassingCars++;
        if (index2 === 0) allStreetIndexes[st].nbStartedCars++;
        if (index2 > 0) totalTime += allStreetIndexes[st].long;
        if (index2 < array.length - 1) {
          allStreetIndexes[st].enable = true;
        }
        if (index2 === array.length - 1) {
          allStreetIndexes[st].nbEndedCars++;
        }
      }

      // Ignore the unreach able car
      const car = new Car(carIndex, nbRues, totalTime, streetArray);
      allCars.push(car);
      carIndex++;
    }
  }
  inputLineIndex++;
};

/**
 * Process at the end of the input file
 */
const endProcessFct = () => {
  console.log("Finish reading input file: ", inputLineIndex);
  // quickSort(allLibraries, false, "signupTime");
  cleanData();
  resolveTheProblem();
  printOutput(
    outputPath,
    allIntersections.filter(
      (intersection) => intersection.scheduleIncomingStreets.length > 0
    )
  );
};

// START APPLICATION
if (process.argv.length < 3) {
  console.error("MISSING ARGUMENT!");
  process.exit(1);
}
// Parse arguments
// CONFIG INTPUT and OUTPUT
const dataPath = process.argv[2];
const inputArrayPaths = dataPath.split("/");
const outputPath = `${
  inputArrayPaths[inputArrayPaths.length - 1]
}_${Date.now()}.txt`;
console.log("Input data: ", dataPath);
console.log("Output will be: ", outputPath);
processInputFile(dataPath, lineProcessFct, endProcessFct);
