const _ = require('underscore');

const createEmptyMap = (count) => {
  const result = new Map();
  _.range(1, +count + 1).forEach(i => result.set(i, []));
  return result;
};


// content:
// 15
// 15 1
// 9 9
// 4 15
// 15 4
// 3 15
// 5 13
//  строит список смежности
const createAdjacencyList = (content) => {
  const count = content.split('\n')[0];
  const adjacencyList = createEmptyMap(count);

  content.split('\n').forEach((row) => {
    const [a, b] = row.split(/\s/);

    if (a && b) {
      adjacencyList.get(+a).push(+b);
      if (a !== b) {
        // при необходимости раскоментировать
        // adjacencyList.get(+b).push(+a);
      }
    }
  });

  return adjacencyList;
};


const createEmptyMatrix = (rows, columns = 0) => {
  const arr = [];
  for (let i = 0; i < rows; i += 1) {
    arr[i] = [];
    for (let j = 0; j < columns; j += 1) {
      arr[i][j] = 0;
    }
  }
  return arr;
};

export { createAdjacencyList };
