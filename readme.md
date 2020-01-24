# PostHTML Plugin Link Preload <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

This plugin removes duplicated tags. It can be used to remove duplicated css and script tags when your markup is assembling code from different sources. 

Before:
``` html
<html>
  <body>
    <link rel="stylesheet" type="text/css" href="component.css">
    <div>... component...</div>
    <link rel="stylesheet" type="text/css" href="component.css">
    <div>... component...</div>
  </body>
</html>
```

After:
``` html
<html>
  <body>
    <link rel="stylesheet" type="text/css" href="component.css">
    <div>... component...</div>
    <div>... component...</div>
  </body>
</html>
```

## Install

> npm i posthtml posthtml-plugin-link-preload

## Usage

``` js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlPluginRemoveDuplicates = require('posthtml-plugin-link-preload');

posthtml()
    .use(posthtmlPluginRemoveDuplicates({ css: true, js: true }))
    .process(html)
    .then(result => fs.writeFileSync('./after.html', result.html));
```

## Options

* css: remove duplicated css tags (default false)
* js: remove duplicated script tags (default false)
* custom: object or array of objects, with tag (optional) and attribute (mandatory) `{ tag: 'div', attr: 'data-remove-dup' }`
