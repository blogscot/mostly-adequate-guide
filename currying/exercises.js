let R = require('ramda')

// Exercise 1
//==============
// Refactor to remove all arguments by partially applying the function.

let words =  R.split(' ')

const sentences = R.map(words)

const s = ['Refactor to remove', 'all arguments by partially', 'applying the function.']
console.log(sentences(s))



// Exercise 2
//==============
// Refactor to remove all arguments by partially applying the functions.

var filterQs = R.filter(v => v != 'q')

console.log(R.map(filterQs, ['abc', 'quick', 'aqua']))



// Exercise 3
//==============
// Use the helper function _keepHighest to refactor max to not reference any
// arguments.

// LEAVE BE:
const _keepHighest = (x, y) => x >= y ? x : y

var max = (...xs) => R.reduce(_keepHighest, -Infinity, xs)

console.log(max(4,32,31,-93,2))