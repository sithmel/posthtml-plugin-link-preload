const matchHelper = require('posthtml-match-helper')

// <link rel="preload" src="script.js" as="script" />

// link: </assets/jquery.js>; rel=preload
// link: </cdn/vendor/library/tes-events-sync-4.0.0.min.js>; rel=preload; as=script, </cdn/service-site-assets/2b34421/css/base.css>; rel=preload; as=style, </cdn/service-site-assets/2b34421/js/common-head-utils.js>; rel=preload; as=script

function nodeToAs (node) {
  const tag = node.tag
  const attrs = node.attrs || {}
  if (tag === 'script') return 'script'
  if (tag === 'link' && attrs.rel === 'stylesheet') return 'style'
  if (tag === 'audio') return 'audio'
  if (tag === 'video') return 'video'
  if (tag === 'track') return 'track'
  if (tag === 'img') return 'image'
  if (tag === 'iframe') return 'document'
  if (tag === 'embed') return 'embed'
  if (tag === 'object') return 'object'
  return ''
}

function nodeToHref (node) {
  const tag = node.tag
  const attrs = node.attrs || {}
  if (tag === 'script') return attrs.src
  if (tag === 'link' && attrs.rel === 'stylesheet') return attrs.href
  if (tag === 'audio') return attrs.src
  if (tag === 'video') return attrs.src
  if (tag === 'track') return attrs.src
  if (tag === 'img') return attrs.src
  if (tag === 'iframe') return attrs.src
  if (tag === 'embed') return attrs.src
  if (tag === 'object') return attrs.data
  return ''
}

module.exports = function (opts = {}) {
  const htmlAttr = opts.attr || 'data-link-preload'
  const addHeader = opts.addHeader || (() => {})
  const htmlAttrType = `${htmlAttr}-type`
  const selStr = `[${htmlAttr}]`

  return function addClientHint (tree) {
    const hints = []

    tree.match(matchHelper(selStr), (node) => {
      const rel = node.attrs[htmlAttr] || 'preload' // prefetch, preload
      const hintType = node.attrs[htmlAttrType] || 'header' // header, markup, header-nopush
      const hintData = {
        rel, hintType, href: nodeToHref(node), as: nodeToAs(node)
      }
      hints.push(hintData)
      return node
    })

    tree.match({ tag: 'head' }, (node) => {
      const linkTags = hints
        .filter((hint) => hint.hintType === 'markup')
        .map((hint) => ({
          tag: 'link',
          attrs: { as: hint.as, rel: hint.rel, href: hint.href }
        }))

      node.content = node.content || []
      while (linkTags.length) {
        node.content.unshift(linkTags.pop())
      }

      return node
    })

    const linkHeader = hints
      .filter((hint) => hint.hintType === 'header' || hint.hintType === 'header-nopush')
      .map((hint) => `<${hint.href}>; rel=${hint.rel}; as=${hint.as}${hint.hintType === 'header-nopush' ? '; nopush' : ''}`)
      .join(', ')

    addHeader('link', linkHeader)

    return tree
  }
}
