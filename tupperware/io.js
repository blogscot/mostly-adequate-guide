
const _ = require('ramda')

const IO = function(f) { this.unsafePerformIO = f }

IO.of = x => new IO(() => x )

IO.prototype.map = function(f) {
  return new IO(_.compose(f, this.unsafePerformIO))
}

module.exports = IO
