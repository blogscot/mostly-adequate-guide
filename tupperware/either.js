const Left = function(x) { this.__value = x }
Left.of = x => new Left(x);
Left.prototype.map = function(f) { return this }

const Right = function(x) { this.__value = x }
Right.of = x => new Right(x)
Right.prototype.map = function(f) { return Right.of(f(this.__value)) }

module.exports = {Left, Right}
