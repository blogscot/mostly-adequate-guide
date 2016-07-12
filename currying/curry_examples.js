var curry = require('lodash.curry');

// Definitions

var match = curry(function(what, str) {
  return str.match(what);
});

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

var filter = curry(function(f, ary) {
  return ary.filter(f);
});

var map = curry(function(f, ary) {
  return ary.map(f);
});


// Examples

const hasSpaces = match(/\s+/g)
const findSpaces = filter(hasSpaces)
console.log( findSpaces(['tori_spelling', 'tori amos'] ))

const noVowels = replace(/[aeiouy]/ig)
const censored = noVowels("-")
console.log( censored("SuperMan vs Batman"))