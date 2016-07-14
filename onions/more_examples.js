const _ = require('ramda')
const Maybe = require('data.maybe')

const compose = _.compose
const map = _.map

const duplicate = n => [n, n]
console.log(_.chain(compose(map(_.toUpper), duplicate), "boat"))

const add2 = num => Maybe.of(2).map(_.add(num))
console.log(add2(6))


console.log(Maybe.of(3).chain(three => Maybe.of(2).map(_.add(three)) ))
