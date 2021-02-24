const { compare, swap } = require('./utils');
/**
 * Bubble sort - O(n^2)
 * @param {Array} data Array of data
 * @param {Boolean} desc true - desc, false - inscrease
 * @param {Strign||null} sortKey sorted attribute
 */
const bubbleSort = (array, desc, sortKey = null) => {
  let isSorted = false;
  let lastUnsortedIndex = array.length - 1;
  while(!isSorted) {
    isSorted = true;
    for (let index = 0; index < lastUnsortedIndex; index++) {
      const comp = compare(array[index], array[index + 1], sortKey);
      if (desc && comp === 2 || !desc && comp === 0) {
        swap(array, index, index + 1);
        isSorted = false;
      }
    }
    lastUnsortedIndex--;
  }
};

module.exports = {
  bubbleSort,
};
