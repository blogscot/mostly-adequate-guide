const _ = require('ramda')
const Either = require('data.either')
const Maybe = require('data.maybe')
const Task = require('data.task')

const IO = require('./io')

const Left = Either.Left
const Right = Either.Right


const chain = _.chain
const compose = _.compose
const map = _.map

// Exercise 1
// ==========
// Use safeProp and map/join or chain to safely get the street name when given
// a user.

var safeProp = _.curry(function(x, o) {
  try {
    return Maybe.of(o[x])
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


const street_name = compose(chain(safeProp('name')), chain(safeProp('street')), safeProp('address'))
const _street_name = _.pipe(safeProp('address'), chain(safeProp('street')), chain(safeProp('name')))
// Happy path
console.assert(street_name(user).value == 'Walnut St')
console.assert(_street_name(user).value == 'Walnut St')
// Unhappy path
console.assert(street_name({}).value == null)
console.assert(street_name({address: {}}).value == null)
console.assert(street_name({address: {street: {}}}).value == null)



// Exercise 2
// ==========
// Use getFile to get the filename, remove the directory so it's just the file,
// then purely log it.

var getFile = function() {
  return new IO(function() {
    return __filename
  })
}

const filename = compose(_.head, _.reverse, _.split('\\'))(__filename)
// console.log(filename)
const _filename = compose(map(console.log), map(_.head), map(_.reverse), map(_.split('\\')))
_filename(getFile()).unsafePerformIO()



// Exercise 3
// ==========
// Use getPost() then pass the post's id to getComments().

// getPost :: Integer -> Task Object
var getPost = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res({
        id: i,
        title: 'Love them tasks',
      })
    }, 300)
  })
}

// getComments :: Integer -> Task Object
var getComments = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res([{
        post_id: i,
        body: 'This book should be illegal',
      }, {
        post_id: i,
        body: 'Monads are like smelly shallots',
      }])
    }, 300)
  })
}

const ex3 = compose(chain(compose(getComments, _.prop('id'))), getPost)
ex3(1).fork(err => console.error(err), data => console.log(data))

/*
  We start with getPost which takes an Integer and returns a Object.
  Note, prop('id') takes an Object and returns an Integer. If prop and
  getComments are composed the resulting function has the type signature:

  Object -> Task Object.

  To avoid the final result being wrapped in two Tasks, chain is used to apply
  the composed function over the container (chain is map then join). The two
  parts are wired together using compose. Et voila!
*/



// Exercise 4
// ==========
// Use validateEmail, addToMailingList, and emailBlast to implement ex4's type
// signature.

//  addToMailingList :: Email -> IO([Email])
var addToMailingList = (function(list) {
  return function(email) {
    return new IO(function() {
      list.push(email);
      return list;
    });
  };
})([]);

// emailBlast :: Array -> IO String
function emailBlast(list) {
  return new IO(function() {
    return 'emailed: ' + list.join(',');
  });
}

// validateEmail :: Email -> Either String
var validateEmail = function(x) {
  return x.match(/\S+@\S+\.\S+/) ? (new Right(x)) : (new Left('invalid email'));
};

//  ex4 :: Email -> Either String (IO String)

const ex4 = compose(map(compose(chain(emailBlast), addToMailingList)), validateEmail)

/*
  We start with validateEmail which is nice and simple as it takes an Email and
  returns an Either String.

  Remember with type signatures the first type is
  the first one to be applied, as we're dealing with container types. The onion
  metaphor is quite appropriate here - as monads are applied to the inner container
  they progressively wrap it from the inside out.

  Both addToMailingList and emailBlast wrap the container with the IO monad so its
  helpful to apply flatMap (that is, chain) so that the container is only wrapped
  once.
  The next step is to compose the two functions and map the result onto the
  container. The map function applies the new composed function to the contents
  of the container.
  Finally, everything is wired up by composing the two parts together. Job done!
*/