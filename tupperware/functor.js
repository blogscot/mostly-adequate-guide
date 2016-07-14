
// Container

const Container = function(x) {
  this.__value = x
}

Container.of = function(x) { return new Container(x) }

Container.prototype.map = function(f) {
  return Container.of(f(this.__value));
}

// Maybe

var Maybe = function(x) {
  this.__value = x;
};

Maybe.of = function(x) {
  return new Maybe(x);
};

Maybe.prototype.isNothing = function() {
  return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};

module.exports = {Container, Maybe}
