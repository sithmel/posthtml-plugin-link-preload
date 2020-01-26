# PostHTML Plugin Link Preload <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

This plugin sets up preload/prefetch tags and headers.
* [Read here about preload](https://www.w3.org/TR/preload/)
* [Read here about prefetch](https://www.w3.org/TR/resource-hints/)


Before:
``` html
<html>
  <head>
  ...
  </head>
  <body>
    <div>... component...</div>
    <script
      data-link-preload="preload"
      data-link-preload-type="markup"
      src="component.js"
    ></script>
  </body>
</html>
```

After:
``` html
<html>
  <head>
    <link rel="preload" href="component.js" as="script">
  ...
  </head>
  <body>
    <div>... component...</div>
    <script
      data-link-preload="preload"
      data-link-preload-type="markup"
      src="component.js"
    ></script>
  </body>
</html>
```

## Install

> npm i posthtml posthtml-plugin-link-preload

## Usage

``` js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlPluginLinkPreload = require('posthtml-plugin-link-preload');

posthtml()
    .use(posthtmlPluginLinkPreload({}))
    .process(html)
    .then(result => fs.writeFileSync('./after.html', result.html));
```

## Options

* attr: the html attribute name to use (optional, default: data-link-preload)
* addHeader: a function that is called with 2 arguments: headerName, headerValue (optional, default: an empty function)

## Attribute values
data-link-preload:
- `preload`: enable resource preload (default)
- `prefetch`: enable resource prefetch

data-link-preload-type:
- `header`: does not insert any additional tag. It calls the function "addHeader" with the new header. [Some CDN and HTTP server converts this into HTTP2 server push, if used with preload](https://docs.fastly.com/en/guides/http2-server-push) (default)
- `header-nopush`: like 'header' but it adds 'nopush' to the headers 
- `markup`: adds additional tag at the top of the head tag

## Where to use it
These features can be use on these tags with either srv or href tag:
* script
* link with rel stylesheet
* audio
* video
* track
* img
* iframe
* embed
* object

## Adding headers
Here is an example using Expressjs:
```js
app.get('/', async (req, res) => {
  const html = `
<html>
  <head></head>
  <body>
    <div>... component...</div>
    <script
      data-link-preload="preload"
      data-link-preload-type="header"
      src="component.js"
    ></script>
  </body>
</html>`

  const addHeader = (name, content) => {
    // name: link
    // content: '<component.js>; rel=preload; as=script
    res.set(name, content)
  }

  const result = await posthtml()
    .use(posthtmlPluginLinkPreload({ addHeader }))
    .process(html)

  res.send(result.html)
})
```
