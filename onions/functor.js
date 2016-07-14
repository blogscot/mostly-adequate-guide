const _ = require('ramda')

// Identity

const Identity = function(x) {
  this.__value = x
}

Identity.of = function(x) { return new Identity(x) }

Identity.prototype.map = function(f) {
  return Identity.of(f(this.__value));
}

// Maybe

var Maybe = function(x) {
  this.__value = x
}

Maybe.of = function(x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
  return (this.__value === null || this.__value === undefined);
}

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}

Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of(null) : this.__value;
}

//  chain :: Monad m => (a -> m b) -> m a -> m b
Maybe.prototype.chain = _.curry(function(f, m){
  return m.map(f).join() // or compose(join, map(f))(m)
})  // a.k.a. flatMap!

module.exports = {Identity, Maybe}
