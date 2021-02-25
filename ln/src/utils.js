const fs = require('fs');
const readline = require('readline');

// PRINT OUT THE RESULT

const printOutput = (outputPath, teams) => {
  fs.open(outputPath,'w', (err, fd) => {
    if (err) {
      console.error('ERROR!...');
      return;
    }
    // write header
    fs.writeSync(fd, String(teams.length));
    fs.writeSync(fd,"\n");
    // Write data
    for (let index = 0; index < teams.length; index++) {
      const t = teams[index];
      let str = t.nbMembers;
      for (let p = 0; p < t.deliveredPizzas.length; p++) {
        const pizza = t.deliveredPizzas[p];
        str += ` ${pizza.id}`;
      }
      // const libID = lib.id;
      // const nbShippedBooks = lib.shippedBooks.length;
      // const shippedBookIds = lib.shippedBooks.toString().replace(/,/g,' ');
      // // console.log(`${libID} ${nbShippedBooks}\n`);
      // console.log(`${shippedBookIds}\n`);
      // fs.writeSync(fd, `${libID} ${nbShippedBooks}\n`);
      fs.writeSync(fd, `${str}\n`);
    }
    fs.closeSync(fd);
  });
};


const processInputFile = (inputFilePath, lineProcessFct, endProcessFct) => {
  // Read input file
  const lineReader = readline.createInterface({
    input: fs.createReadStream(inputFilePath)
  });

  lineReader.on('line', lineProcessFct);
  lineReader.on('close', endProcessFct);
}

const getRandomIndex = (max) => {
  const rand = Math.random();
  return Math.floor(rand * max);
}

module.exports = {
  printOutput,
  processInputFile,
  getRandomIndex
}