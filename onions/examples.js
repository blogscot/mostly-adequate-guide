const fs = require('fs')
const _ = require('ramda')

const Maybe = require('./functor').Maybe
const IO = require('./io')

/*
These examples use the local definition of Maybe which works up to a point.
An alternative definition of Maybe can be found from Folktale's data.maybe
library.
*/


const map = _.map
const compose = _.compose
const head = _.head

console.log(IO.of('tetris').map(_.concat(' master')).unsafePerformIO())
console.log(IO.of(1336).map(_.add(1)).unsafePerformIO())


//  readFile :: String -> IO String
const readFile = function(filename) {
  return new IO(function() {
    return fs.readFileSync(filename, 'utf-8')
  })
}

//  print :: String -> IO String
const print = function(x) {
  return new IO(function() {
    console.log(x)
    return x
  })
};

//  cat :: String -> IO (IO String)
const cat = compose(map(print), readFile)
console.log(cat('examples.js').unsafePerformIO().unsafePerformIO())

//  catFirstChar :: String -> IO (IO String)
const catFirstChar = compose(map(map(head)), cat)
console.log(catFirstChar('examples.js').unsafePerformIO().unsafePerformIO())

Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of(null) : this.__value;
}

const mmo = Maybe.of(Maybe.of('nunchucks'));
// console.log(mmo.join())  // { __value: 'nunchucks' }



// Join

//  safeProp :: Key -> {Key: a} -> Maybe a
const safeProp = _.curry(function(x, obj) {
  return new Maybe(obj[x]);
})

//  safeHead :: [a] -> Maybe a
const safeHead = safeProp(0)

//  join :: Monad m => m (m a) -> m a
const join = function(mma) {
  return mma.join();
}

//  firstAddressStreet :: User -> Maybe Street
const firstAddressStreet = compose(
  join, map(safeProp('street')), join, map(safeHead), safeProp('addresses')
)

const addresses = {
  addresses: [{
    street: {
      name: 'Mulburry',
      number: 8402,
    },
    postcode: 'WC2N',
  }],
}

console.log(firstAddressStreet(addresses)) // { __value: { name: 'Mulburry', number: 8402 } }



// //  chain :: Monad m => (a -> m b) -> m a -> m b
chain = _.curry(function(f, m){
  return m.map(f).join(); // or compose(join, map(f))(m)
})  // a.k.a. flatMap!


// chain
var _firstAddressStreet = compose(
  chain(safeProp('street')), chain(safeHead), safeProp('addresses')
)

console.log(_firstAddressStreet(addresses)) // { __value: { name: 'Mulburry', number: 8402 } }
