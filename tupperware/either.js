const _ = require('ramda')
const moment = require('moment')

// A few convenience ramda mappings
const curry = _.curry
const compose = _.compose
const concat = _.concat
const add = _.add
const map = _.map

var Left = function(x) { this.__value = x }
Left.of = x => new Left(x);
Left.prototype.map = function(f) { return this }

var Right = function(x) { this.__value = x }
Right.of = x => new Right(x)
Right.prototype.map = function(f) { return Right.of(f(this.__value)) }

console.log(Right.of('rain').map(v=>'b'+v))
console.log(Right.of({
  host: 'localhost',
  post: 80
}).map(_.prop('host')))

console.log(Left.of('leave me alone').map(v=>"GET UP!"))

//  getAge :: Date -> User -> Either(String, Number)
const getAge = curry(function(now, user) {
  var birthdate = moment(user.birthdate, 'YYYY-MM-DD')
  return birthdate.isValid() ?
    Right.of(now.diff(birthdate, 'years')) :
    Left.of('Birth date could not be parsed')
})

console.log(getAge(moment(), { birthdate: '2005-12-12' }))
console.log(getAge(moment(), { birthdate: '20052212' }))

//  fortune :: Number -> String
const fortune = compose(concat('If you survive, you will be '), add(1))

//  zoltar :: User -> Either(String, _)
const zoltar = compose(map(console.log), map(fortune), getAge(moment()))

zoltar({ birthdate: '2005-12-12' })
console.log(zoltar({ birthdate: 'sex, drugs, rock-n-roll' }))

//  either :: (a -> c) -> (b -> c) -> Either a b -> c
const either = curry(function(f, g, e) {
  switch (e.constructor) {
    case Left:
      return f(e.__value);
    case Right:
      return g(e.__value);
  }
})

//  _zoltar :: User -> _
const _zoltar = compose(console.log, either(_.identity, fortune), getAge(moment()))
_zoltar({ birthdate: '2005-12-12', })
_zoltar({ birthdate: 'sex, drugs, rock-n-roll' })
