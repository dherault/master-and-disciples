const treeify = require('treeify')

// const tree = {
//   $: 0,
//   _: [
//     {
//       $: 0,
//     },
//     {
//       $: 0,
//       _: [
//         {
//           $: 0,
//         },
//       ]
//     },
//   ],
// }

const nPeriods = 1
const nCommuniPerPeriodPerNode = 128

const sum = (a, b) => a + b

function countNodes(tree) {
  let count = 1

  if (tree._) {
    count += tree._.map(node => countNodes(node)).reduce(sum, 0)
  }

  return count
}

function generateTree(maxDepth = 4, minB = 0, maxB = 8, depth = 1) {
  const tree = {
    $: 0,
    _: [],
  }

  if (depth === maxDepth) return tree

  const nChildren = pickRandomInteger(minB, maxB)

  for (let i = 0; i < nChildren; i++) {
    tree._.push(generateTree(maxDepth, minB, maxB, depth + 1))
  }

  return tree
}

function pickRandomInteger(min, max) {
  return Math.round(Math.random() * (max - min + 1) + min)
}

function distribute(tree) {
  const n = countNodes(tree)
  const $ = n * nCommuniPerPeriodPerNode

  const tax = 16
  const remainder = nCommuniPerPeriodPerNode - tax

  traverseTreeReverse(tree, node => {
    node.$ = nCommuniPerPeriodPerNode - tax,
    node.tax = tax + (node._.map(child => child.tax).reduce(sum, 0) || 0)
  })
}

function traverseTree(tree, fn) {
  fn(tree)

  tree._.forEach(node => traverseTree(node, fn))
}

function traverseTreeReverse(tree, fn) {
  tree._.forEach(node => traverseTreeReverse(node, fn))

  fn(tree)
}

const tree = generateTree()

const n = countNodes(tree)

const $ = n * nCommuniPerPeriodPerNode

distribute(tree)

console.log(treeify.asTree(tree, true))
console.log('N nodes:', n, '$', $)
console.log('root tax', tree.tax, tree.tax / n)
