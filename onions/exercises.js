const _ = require('ramda')
const Maybe = require('data.maybe')


// Exercise 1
// ==========
// Use safeProp and map/join or chain to safely get the street name when given
// a user.

var safeProp = _.curry(function(x, o) {
  return Maybe.of(o[x]);
})

var user = {
  id: 2,
  name: 'albert',
  address: {
    street: {
      number: 22,
      name: 'Walnut St',
    },
  },
}


// console.log(safeProp('address')(user))
const street_name = user => safeProp('address')(user)
  .chain(address => safeProp('street')(address))
  .chain(street => safeProp('name')(street).value)

console.assert(street_name(user) == 'Walnut St')
console.assert(safeProp('address')({}).value == undefined)
const _street_name = user => safeProp('address')(user)
.chain(address => address == undefined ? Maybe.of(null) : safeProp('street')(address))
.chain(street => street == null ? Maybe.of(null) : safeProp('name')(street))
.chain(name => name == null ? Maybe.of(null) : name)
console.assert(_street_name({}).value == null)
console.assert(_street_name({address: {}}).value == null)
console.assert(_street_name({address: {street: {}}}).value == null)
