let R = require('ramda')

const toUpperCase = x => x.toUpperCase()
const toLowerCase = x => x.toLowerCase()
const exclaim = x => x + "!"


var angry = R.compose(exclaim, toUpperCase)
var lastUpper = R.compose(angry, R.head);
console.log(lastUpper(['jumpkick', 'roundhouse', 'uppercut']))

var snakeCase = R.compose(R.replace(/\s+/ig, '_'), R.toLower);
console.log(snakeCase("this is too MUCH to take!"))

const initials = (name) => name.split(' ').map(compose(toUpperCase, head)).join('. ')

const f = R.map(R.compose(toUpperCase, R.head))
const _initials = R.compose(R.join('. '), f, R.split(' '))
console.log(_initials("Iain The King Diamond"))


// Used for debugging
var trace = R.curry(function(tag, x) {
  console.log(tag, x);
  return x;
});

var dasherize = R.compose(R.join('-'), R.map(R.toLower), trace('after-split'),
  R.split(' '), R.replace(/\s{2,}/ig, ' '));
dasherize('The World is a vampire');