const test = require('ava')
const plugin = require('..')
const posthtml = require('posthtml')

const htmlClientHint = `<!doctype html>
<html>
    <head></head>
    <body>
      <script data-link-preload="preload" data-link-preload-type="markup" src="/script1.js"></script>
      <img data-link-preload="prefetch" data-link-preload-type="markup" src="/picture.png">
    </body>
</html>`

const clientHintResult = `<!doctype html>
<html>
    <head><link as="script" rel="preload" href="/script1.js"><link as="image" rel="prefetch" href="/picture.png"></head>
    <body>
      <script data-link-preload="preload" data-link-preload-type="markup" src="/script1.js"></script>
      <img data-link-preload="prefetch" data-link-preload-type="markup" src="/picture.png">
    </body>
</html>`

const htmlClientHintOnServer = `<!doctype html>
<html>
    <head></head>
    <body>
      <script data-link-preload="preload" src="/script1.js"></script>
      <link rel="stylesheet" data-link-preload="preload" data-link-preload-type="header-nopush" href="/style.css">
      <video src="video.mp4" data-link-preload="prefetch"></video>
    </body>
</html>`

test('add client hint', (t) => {
  return posthtml([plugin()])
    .process(htmlClientHint)
    .then((res) => t.truthy(res.html === clientHintResult))
})

test('add client hint on server', (t) => {
  let headerName
  let headerContent
  const addHeader = (name, content) => {
    headerName = name
    headerContent = content
  }
  return posthtml([plugin({ addHeader })])
    .process(htmlClientHintOnServer)
    .then((res) => {
      t.truthy(headerName === 'link')
      t.truthy(headerContent === '</script1.js>; rel=preload; as=script, </style.css>; rel=preload; as=style; nopush, <video.mp4>; rel=prefetch; as=video')
      t.truthy(res.html === htmlClientHintOnServer)
    })
})
