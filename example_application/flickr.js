requirejs.config({
  paths: {
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.13.0/ramda.min',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min'
  },
})

require([ 'ramda', 'jquery' ],

(_, $) => {
  var trace = _.curry(function(tag, x) {
    console.log(tag, x)
    return x
  })

  const Impure = {
    getJSON: _.curry((callback, url) => $.getJSON(url, callback) ),
    setHtml: _.curry((sel, html) => $(sel).html(html) )
  }

  const img = url => $('<img />', { src: url })

  const url = term =>
    `https://api.flickr.com/services/feeds/photos_public.gne?tags=${term}&format=json&jsoncallback=?`

  const mediaUrl = _.compose(_.prop('m'), _.prop('media'))
  const mediaToImg = _.compose(img, mediaUrl)
  const images = _.compose(_.map(mediaToImg), _.prop('items'))
  const renderImages = _.compose(Impure.setHtml('body'), images)
  const app = _.compose(Impure.getJSON(renderImages), url)

  app('dundee')
})