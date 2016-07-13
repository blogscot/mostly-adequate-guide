const _ = require('ramda')
const Maybe = require('./functor').Maybe

// A few convience ramda mappings
const compose = _.compose
const prop = _.prop
const head = _.head
const identity = _.identity
const last = _.last
const filter = _.filter


const IO = function(f) { this.unsafePerformIO = f }

IO.of = x => new IO(() => x )

IO.prototype.map = function(f) {
  return new IO(_.compose(f, this.unsafePerformIO))
};

//  io_window :: IO Window
const io_window = new IO( () => window )

console.log(io_window.map(win => win.innerWidth))
console.log(io_window.map(_.prop('location')).map(_.prop('href')).map(_.split('/')))

//  $ :: String -> IO [DOM]
const $ = function(selector) {
  return new IO(function() {
    return document.querySelectorAll(selector);
  });
};

$('#myDiv').map(head).map(div => div.innerHTML)


//  url :: IO String
const url = new IO(function() {
  // return window.location.href
  // HACK: hack it until it works!
  return "http://www.example.com?searchTerm=waffleHouse"
})

//  toPairs =  String -> [[String]]
const toPairs = compose(_.map(_.split('=')), _.split('&'))

//  params :: String -> [[String]]
const params = compose(toPairs, last, _.split('?'))

//  findParam :: String -> IO Maybe [String]
const findParam = function(key) {
  return _.map(compose(Maybe.of, filter(compose(_.equals(key), head)), params), url)
}

/*
  url returns 'IO String'; a String wrapped in an IO. The 'head' and 'equals'
  functions deal with, in this case, strings. They are 'lift' by map to be able
  to operate on IO containers. So we end up with strings wrapped in an array
   wrapped in a Maybe wrapped in an IO. Whoop!
  */

  console.log(findParam("searchTerm").unsafePerformIO())
