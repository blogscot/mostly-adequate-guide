const _ = require('ramda')
const Maybe = require('data.maybe')


// Exercise 1
// ==========
// Use safeProp and map/join or chain to safely get the street name when given
// a user.

var safeProp = _.curry(function(x, o) {
  try {
    return Maybe.of(o[x]);
  } catch (e) {
    return Maybe.of(null)
  }
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


const street_name = _.compose(_.chain(safeProp('name')), _.chain(safeProp('street')), safeProp('address'))
// Happy path
console.assert(street_name(user).value == 'Walnut St')
// Unhappy path
console.assert(street_name({}).value == null)
console.assert(street_name({address: {}}).value == null)
console.assert(street_name({address: {street: {}}}).value == null)
