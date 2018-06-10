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
        adjacencyList.get(+b).push(+a);
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

// context - содержимое файла
// Построить и вывести на экран матрицу смежности.
// возвращяет матрицу смежности
const stringToAdjacencyMatrix = (context) => {
  const count = context.split('\n')[0];
  const adjacencyMatrix = createEmptyMatrix(count, count);

  context.trim().split('\n').forEach((row) => {
    const [a, b] = row.split(/\s/);

    if (a && b) {
      adjacencyMatrix[a - 1][b - 1] = 1;
      adjacencyMatrix[b - 1][a - 1] = 1;
    }
  });

  return adjacencyMatrix;
};

// context - содержимое файла
// Определить степени всех вершин и вывести список вершин с их степенями.
// возвращяет Map где key - спискок вершин, value - степень вершины
const getDegreesOfVertices = (context) => {
  const result = new Map();
  createAdjacencyList(context).forEach((value, key) => result.set(key, value.map(i => i.length)));
  return result;
};

// context - содержимое файла
// Определить изолированные вершины и вывести их список.
// возвращяет массив изолированных вершин
const getIsolatedVertices = (context) => {
  const result = [];
  createAdjacencyList(context).forEach((item, index) => item.length === 0 && result.push(index));
  return result;
};

// context - содержимое файла
// Определить висячие вершины и вывести их список.
// возвращяет массив висячиx вершин
const getPendantVertices = (context) => {
  const result = [];
  createAdjacencyList(context)
    .forEach((item, index) => item.length === 1 && item[0] !== index && result.push(index));
  return result;
};

// context - содержимое файла
// Определить висячие ребра и вывести их список.
// возвращяет массив висячиx ребер
const getPendantVerges = (context) => {
  const result = [];
  createAdjacencyList(context).forEach((item, index) => {
    if (item.length === 1 && item[0] !== index) result.push([item[0], index]);
  });
  return result;
};

// context - содержимое файла
// Определить вершины, в которых имеются петли, и вывести список таких вершин с кратностями петель.
// возвращяет массив объектов
const getLoops = (context) => {
  const result = [];
  createAdjacencyList(context).forEach((item, index) => {
    const loops = item.filter(i => i === index);
    if (loops.length > 0) {
      result.push({ a: index, b: loops.length });
    }
  });
  return result;
};

// context - содержимое файла
// кратные ребра и выводит их список с кратностями
// возвращяет массив объектов
const getMultipleVerges = (context) => {
  const result = [];
  createAdjacencyList(context).forEach((item, index) => {
    const arr = [...new Set(item)];
    arr.forEach((i) => {
      const count = item.filter(a => a === i).length;
      result.push({ a: `${i}-${index}`, b: count });
    });
  });
  return result;
};

// Приводит исходный граф к форме простого графа:
// удаляет петли и для кратных ребер оставляет только одно ребро.
// Для преобразованного графа выводит списки смежности
// возвращяет список смежности
const graphToSimpleForm = (context) => {
  const result = new Map();
  const adjacencyList = createAdjacencyList(context);
  adjacencyList.forEach((row, index) => {
    const array = row.filter(item => item !== index);
    result.set(index, [...new Set(array)]);
  });
  result.forEach((row, index) => {
    const array = row.filter(item => result.get(item).indexOf(index) === -1);
    // console.log(index, row);
    result.set(index, [...array]);
  });
  return result;
};


const awesomeGraph = (context) => {
  const result = new Map();
  const adjacencyList = createAdjacencyList(context);
  adjacencyList.forEach((row, index) => {
    const array = row.filter(item => item !== index);
    result.set(index, [...new Set(array)]);
  });
  return result;
};

const adjacencyListToSimpleForm = (adjacencyList) => {
  const result = new Map();
  adjacencyList.forEach((row, index) => {
    const array = row.filter(item => item !== index);
    result.set(index, [...new Set(array)]);
  });
  result.forEach((row, index) => {
    const array = row.filter(item => result.get(item).indexOf(index) === -1);
    // console.log(index, row);
    result.set(index, [...array]);
  });
  return result;
};

// context - содержимое файла
// Определяет количество компонент связности преобразованного графа
// выводит на экран состав каждой компоненты в форме списка входящих в компоненту вершин
// Возвращяет массивы вершин
const findComponentOfTheTransformedGraph = (context) => {
  const result = [];
  const simpleForm = graphToSimpleForm(context);
  graphToSimpleForm(context).forEach((array, index) => {
    if (_.flatten(result).indexOf(index) === -1) {
      let preResult = _.uniq([index, ...array]);
      preResult.forEach(i => preResult.push(simpleForm.get(i)));
      preResult = _.uniq(_.flatten(preResult));
      let isNew = true;
      let arr = [];
      result.forEach((s, i1) => {
        s.forEach((t) => {
          if (preResult.indexOf(t) !== -1) {
            arr = _.uniq([...preResult, ...s]);
            isNew = i1;
          }
        });
      });
      if (isNew === true) {
        result.push(preResult);
      } else {
        result[isNew] = arr;
      }
    }
  });
  return result;
};

const colors = [
  '#ff0000',
  '#7a71ff',
];

const getNodes = (adjacencyList, arr = []) => ([...adjacencyList.keys()]
  .map(i => ({ id: i, label: `${i}`, color: arr.indexOf(i) === -1 ? colors[1] : colors[0] })));

const isEqualEdges = (edges1, edges2) => ((edges1.from === edges2.from && edges1.to === edges2.to)
  || (edges1.from === edges2.to && edges1.from === edges2.to));

const getEdges = (adjacencyList) => {
  const result = [];
  adjacencyList.forEach((value, key) => {
    value.forEach(i => result.push({ from: key, to: i }));
  });
  return result;
};

const edgeGraphVertexToNum = i => Number(i.split(',').map(j => (j.trim())).join('00'));
const getNodesForEdge = adjacencyList => ([...adjacencyList.keys()].map(i => ({ id: edgeGraphVertexToNum(i), label: `${i}` })));

const getEdgesForEdge = (adjacencyList) => {
  const result = [];
  adjacencyList.forEach((value, key) => {
    value.forEach(i => result.push({ from: edgeGraphVertexToNum(key), to: edgeGraphVertexToNum(i) }));
  });
  return result;
};

const isEqualKey = (key1, key2) => {
  const [key1a, key1b] = key1.split(',').map(i => (i.trim()));
  const [key2a, key2b] = key2.split(',').map(i => (i.trim()));
  return ((key1a === key2a && key1b === key2b) || (key1a === key2b && key1a === key2b));
};

const isSameKey = (key1, key2) => {
  const [key1a, key1b] = key1.split(',').map(i => (i.trim()));
  const [key2a, key2b] = key2.split(',').map(i => (i.trim()));
  return (key1a === key2a || key1b === key2b || key1a === key2b || key1a === key2b);
};

const revertKey = (key) => {
  const [key1a, key1b] = key.split(',').map(i => (i.trim()));
  return `${key1b}, ${key1a}`;
};

const getEdgeGraph = (content) => {
  const resultAdjacencyList = new Map();
  content.trim().split('\n').forEach((row) => {
    const [a, b] = row.split(/\s/);
    if (a && b && [...resultAdjacencyList.keys()].filter(str => isEqualKey(str, `${a}, ${b}`)).length === 0) {
      resultAdjacencyList.set(`${a}, ${b}`, []);
    }
  });
  const keys = [...resultAdjacencyList.keys()];
  resultAdjacencyList.forEach((row, key) => {
    const checkKey = (a, arr) => arr.indexOf(a) === -1 && arr.indexOf(revertKey(a)) === -1;
    const arr = keys.filter(i => (i !== key && isSameKey(key, i) && checkKey(key, resultAdjacencyList.get(i))));
    resultAdjacencyList.set(key, arr);
  });
  return resultAdjacencyList;
};


const getTreeDFS = (array, content) => {
  const result = new Map();
  array.forEach(i => result.set(i, []));
  let iterator = [[...result.keys()][0]];
  const first = iterator[0];
  const simpleForm = awesomeGraph(content);
  let checkArray = [...array.filter(i => i !== first)];
  while (true) {
    const rebra = simpleForm.get(iterator[0]); // TODO rename
    if (!rebra) {
      break;
    } else {
      // eslint-disable-next-line no-loop-func,max-len
      const currentRebra = rebra && rebra.filter(i => _.flatten([...result.values(), first]).indexOf(i) === -1);
      checkArray = checkArray.filter(i => currentRebra.indexOf(i) === -1);
      result.set(iterator[0], currentRebra);
      iterator.shift();
      // const secArr = rebra
      iterator = [...iterator, ...rebra];
      if (checkArray.length === 0) break;
    }
  }
  return result;
};

const getTreesDFS = (content) => {
  const result = [];
  findComponentOfTheTransformedGraph(content)
    .forEach(i => i.length > 1 && result.push(getTreeDFS(i, content)));
  return result;
};

const getAllVertexForEdge = (graph, key) => {
  const result = [...graph.keys()].filter(a => isSameKey(a, key));
  // graph.forEach((value, i) => {
  //   value.forEach(a => isSameKey(key, a) && result.push(i));
  //   // if (value.indexOf(key) !== -1) result.push(i);
  // });
  return _.uniq(result);
};

const dominantSetOfEdge = (content) => {
  const graff = getEdgeGraph(content);
  const result = [];
  while ([...graff.keys()].length) {
    const keys = [...graff.keys()]
      .sort((a, b) => getAllVertexForEdge(graff, b).length - getAllVertexForEdge(graff, a).length);
    console.log(keys[0]);
    result.push(keys[0]);
    const deletedKeys = getAllVertexForEdge(graff, keys[0]);
    [...deletedKeys].forEach(key => graff.delete(key));
  }
  return result;
};

const getAllVertex = (graph, key) => {
  const result = graph.get(key);
  graph.forEach((value, i) => {
    if (value.indexOf(key) !== -1) result.push(i);
  });
  return result;
};

const dominantSetOfVertices = (content) => {
  const graff = graphToSimpleForm(content);
  const result = [];
  while ([...graff.keys()].length) {
    const keys = [...graff.keys()]
      .sort((a, b) => getAllVertex(graff, b).length - getAllVertex(graff, a).length);
    result.push(keys[0]);
    const deletedKeys = getAllVertex(graff, keys[0]);
    [...deletedKeys, keys[0]].forEach(key => graff.delete(key));
  }
  return result;
};

const checkByBFS = (content) => {
  const graph = createAdjacencyList(content);
  const keys = [...graph.keys()].sort();
  const min = keys[0];
  const max = keys[keys.length - 1];
  const queue = [];
  const part = keys.map(() => -1);
  let result = true;
  for (let i = min; i < max; i += 1) {
    let h = min;
    let t = min;
    t += 1;
    queue[t] = i;
    part[i] = 0;
    while (h < t) {
      h += 1;
      const vertex = queue[h] || 8;
      console.log(vertex);
      for (let j = 0; j < graph.get(vertex).length; j += 1) {
        const to = graph.get(vertex)[j];
        if (part[to] === -1) {
          part[to] = !part[vertex];
          queue[t] = to;
          t += 1;
        } else if (part[to] === part[vertex] && !result) {
          result = false;
        }
      }
    }
  }
  return result;
};

const stringToAdjacencyList = (content) => {
  const count = content.split('\n')[0];
  const adjacencyList = createEmptyMap(count);

  content.split('\n').forEach((row) => {
    const [a, b, r] = row.split(/\s/);

    if (a && b) {
      adjacencyList.get(+a).push({ vertex: +b, value: +r });
      if (a !== b) {
        // при необходимости раскоментировать
        adjacencyList.get(+b).push({ vertex: +b, value: +r });
      }
    }
  });
};

var DHeap = require('d-heap');

const primMST = (edges) => {
  var mst = [],
    nodes = [],
    queue,
    edge, node, adjacent, v, u, w, vn, un, i, l;

  for (i = 0, l = edges.length; i < l; ++i) {
    edge = edges[i];
    v = edge[0];
    u = edge[1];
    w = edge[2];

    vn = nodes[v] ||
      (nodes[v] = { v: v, w: Infinity, p: null, visited: false, adjacent: [] });
    un = nodes[u] ||
      (nodes[u] = { v: u, w: Infinity, p: null, visited: false, adjacent: [] });

    vn.adjacent[u] = w;
    un.adjacent[v] = w;
  }

  queue = new DHeap([nodes[edges[0][0]]], {
    compare: function(a, b) {
      return (b != null ? b.w : 0) - (a != null ? a.w : 0);
    }
  });

  while (v = queue.pop()) {
    v.visited = true;
    adjacent = v.adjacent;

    for (i = 0, l = adjacent.length; i < l; ++i) {
      w = adjacent[i];
      if (!w) continue;
      u = nodes[i];

      if (!u.visited && w < u.w) {
        u.w = w;
        u.p = v;
        queue.insert(u);
      }
    }
  }

  for (i = 0, l = nodes.length; i < l; ++i) {
    node = nodes[i];

    if (node.p) {
      mst.push([node.v, node.p.v, node.w]);
    }
  }

  return mst;
};

const myPrimMST = (content) => {
  const array = content.split('\n').map((row) => {
    const [a, b, c] = row.split(' ').map(v => +v.trim());
    return [a, b, c];
  });
  return primMST(array);
};

export {
  createAdjacencyList,
  stringToAdjacencyMatrix,
  getDegreesOfVertices,
  getIsolatedVertices,
  getPendantVertices,
  getLoops,
  getMultipleVerges,
  graphToSimpleForm,
  findComponentOfTheTransformedGraph,
  getPendantVerges,
  getNodes,
  getEdges,
};
