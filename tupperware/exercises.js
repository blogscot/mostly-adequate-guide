const Task = require('data.task')
const _ = require('ramda')

const Functor = require('./Functor')
const Either = require('./Either')

const Container = Functor.Container
const Maybe = Functor.Maybe
const Left = Either.Left
const Right = Either.Right


// Exercise 1
// ==========
// Use _.add(x,y) and _.map(f,x) to make a function that increments a value
// inside a functor.


const three = Container.of(3)
// three.map(v=>console.log(v))
// console.log(three.map(v=>_.add(v, 3)))

const add = (f, x) => f.map(v=>_.add(v, x))
// console.log(add(three, 4))


// Exercise 2
// ==========
// Use _.head to get the first element of the list.
const Identity = Container
const xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);

const first = _.head(xs.__value)
const second = _.head(_.tail(xs.__value))
// console.log(`first: ${first}, second: ${second}`)


// Exercise 3
// ==========
// Use safeProp and _.head to find the first initial of the user.
const safeProp = _.curry(function(x, o) {
  return Maybe.of(o[x])
})

const safeHead = function(m) {
  return m.isNothing() ? "Invalid Prop" : _.head(m.__value)
}

var user1 = { id: 2, name: 'Albert' }
var user2 = { /* Oops */ }

const userInitial = safeHead(safeProp('name', user1))
const nullUserInitial = safeHead(safeProp('name', user2))
console.assert(userInitial === 'A')
console.assert(nullUserInitial === 'Invalid Prop')


// Exercise 4
// ==========
// Use Maybe to rewrite ex4 without an if statement.

const ex4 = n => {
  if (n) { return parseInt(n) }
}

const _ex4 = n => Maybe.of(parseInt(n))
const show = m => isNaN(m.__value) ? "Invalid Integer" : m.__value

// console.log(show(_ex4("4")))
// console.log(show(_ex4("Three")))


// Exercise 5
// ==========
// Write a function that will getPost then toUpperCase the post's title.

// getPost :: Int -> Future({id: Int, title: String})
const getPost = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res({
        id: i,
        title: 'Love them futures',
      })
    }, 300)
  })
}

// const ex5 = getPost(1).fork(
//   err => console.error(err),
//   data => console.log(_.toUpper(data.title))
// )


// Exercise 6
// ==========
// Write a function that uses checkActive() and showWelcome() to grant access
// or return the error.

const showWelcome = _.compose(_.concat('Welcome '), _.prop('name'));
// modified showWelcome to use _.concat

const checkActive = function(user) {
  return user.active ? Right.of(user) : Left.of('Your account is not active');
};

const user3 = { active: true, name: 'Iain' }
const user4 = { active: false, name: 'Sally' }
// console.log(checkActive(user3))
// console.log(showWelcome({name: 'Fredrick'}))
const login_message = _.compose(_.map(showWelcome), checkActive)
console.assert(login_message(user3).__value === 'Welcome Iain')
console.assert(login_message(user4).__value === 'Your account is not active')
