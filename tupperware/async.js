const _ = require('ramda')
const fs = require('fs')
const Task = require('data.task')

//  readFile :: String -> Task Error String
const readFile = filename =>
  new Task((reject, result) =>
    fs.readFile(filename, 'utf-8', (err, data) =>
      err ? reject(err) : result(data)
    )
  )

let t = readFile('metamorphosis.txt').map(_.split('. ')).map(_.head)
t.fork(err => console.error(err), data => console.log(data))

t = Task.of(3).map(three => three + 1)
t.fork(err => console.error(err), data => console.log(data))  // Notice, this is output before metamorphosis



//  blogPage :: Posts -> HTML
cons blogPage = Handlebars.compile(blogTemplate);

//  renderPage :: Posts -> HTML
cons renderPage = compose(blogPage, sortBy('date'));

//  blog :: Params -> Task Error HTML
cons blog = compose(map(renderPage), getJSON('/posts'));
