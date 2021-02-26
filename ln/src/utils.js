const fs = require("fs");
const readline = require("readline");

// PRINT OUT THE RESULT

const printOutput = (outputPath, intersections) => {
  fs.open(outputPath, "w", (err, fd) => {
    if (err) {
      console.error("ERROR!...");
      return;
    }
    // write header
    fs.writeSync(fd, `${intersections.length}\n`);
    // Write data
    for (let index = 0; index < intersections.length; index++) {
      const currentInter = intersections[index];
      fs.writeSync(fd, `${currentInter.id}\n`);
      const { scheduleIncomingStreets } = currentInter;
      fs.writeSync(fd, `${scheduleIncomingStreets.length}\n`);
      for (
        let streetIndex = 0;
        streetIndex < scheduleIncomingStreets.length;
        streetIndex++
      ) {
        fs.writeSync(
          fd,
          `${scheduleIncomingStreets[streetIndex].name} ${scheduleIncomingStreets[streetIndex].long}\n`
        );
      }
    }
    fs.closeSync(fd);
  });
};

const processInputFile = (inputFilePath, lineProcessFct, endProcessFct) => {
  // Read input file
  const lineReader = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
  });

  lineReader.on("line", lineProcessFct);
  lineReader.on("close", endProcessFct);
};

const getRandomIndex = (max) => {
  const rand = Math.random();
  return Math.floor(rand * max);
};

module.exports = {
  printOutput,
  processInputFile,
  getRandomIndex,
};
