const _ = require('ramda')
const Functor = require('./functor')

const Container = Functor.Container
const Maybe = Functor.Maybe

const compose = _.compose
const prop = _.prop
const curry = _.curry

console.log(Container.of(2).map(v=>v+2))
console.log(Container.of('flamethrowers!').map(v=>v.toUpperCase()))
console.log(Container.of('bombs').map(_.concat(" away")).map(prop('length')))



console.log(Maybe.of('Iain Diamond').map(_.match(/a/ig)))

console.log(Maybe.of({
  name: 'Dinah',
  age: 14,
}).map(prop('age')).map(_.add(10)))


// Use Cases

var trace = curry(function(tag, x) {
  console.log(tag, x)
  return x
})

//  safeHead :: [a] -> Maybe(a)
const safeHead = xs => Maybe.of(xs[0])
const streetName = compose(_.map(prop('street')), trace('after-safeHead'), safeHead, prop('addresses'));

console.log(`streetName:`, streetName({ addresses: [], }))
console.log(`streetNames:`,
  streetName({ addresses: [
    { street: 'Shady Ln.', number: 4201, },
    { street: 'Lazy Ln.', number: 4223, }
  ]
 }))


 // Helpers

//  withdraw :: Number -> Account -> Maybe(Account)
var withdraw = curry(function(amount, account) {
  return account.balance >= amount ?
    Maybe.of({
      balance: account.balance - amount,
    }) :
    Maybe.of(null);
});

//  finishTransaction :: Account -> String
 const finishTransaction = account => 'Your balance is ' + account.balance

 //  maybe :: b -> (a -> b) -> Maybe a -> b
 var maybe = curry(function(x, f, m) {
   return m.isNothing() ? x : f(m.__value);
 })

 //  getTwenty :: Account -> String
var getTwenty = compose( maybe("You're broke!", finishTransaction), withdraw(20) )

console.log(getTwenty({ balance: 200.00 }))
console.log(getTwenty({ balance: 10.00 }))


