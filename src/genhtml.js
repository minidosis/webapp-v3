
const { parse } = require('@minidosis/markright')

const escape = (text) => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    switch (text[i]) {
      case '<': result += '&lt;'; break;
      case '>': result += '&gt;'; break;
      default: result += text[i]; break;
    }
  }
  return result
}

const divideByParagraphs = paragraphFunc => ({ children }) => {
  let html = ''
  let paragraph = ''
  for (let item of children) {
    if (item === '') {
      if (paragraph) {
        html += paragraphFunc(paragraph)
        paragraph = ''
      }
    } else {
      paragraph += item + ' '
    }
  }
  if (paragraph) {
    html += paragraphFunc(paragraph)
  }
  return html
}

const HtmlFuncMap = {

  minidosis: ({ args, rawChildren }) => `<a href="${"id/" + args[0]}">${parse(rawChildren, HtmlFuncMap)}</a>`,

  a: ({ args, rawChildren }) => `<a href="${args[0]}">${parse(rawChildren, HtmlFuncMap)}</a>`,
  b: ({ rawChildren }) => `<b>${parse(rawChildren, HtmlFuncMap)}</b>`,
  em: ({ rawChildren }) => `<em>${parse(rawChildren, HtmlFuncMap)}</em>`,
  h2: ({ rawChildren }) => `<h2>${parse(rawChildren, HtmlFuncMap)}</h2>`,

  olist: ({ rawChildren }) => {
    let html = `<div class="enumerate">`
    let num = 1
    parse(rawChildren, {
      row({ rawChildren }) {
        html += `<div class="item"><span class="num">${num}</span>`
        html += `<div class="content">`
        html += parse(rawChildren, {
          ...HtmlFuncMap,
          __block__: divideByParagraphs(p => p),
        })
        html += `</div></div>`
        num++
      },
    })
    html += `</div>`
    return html
  },

  ulist: ({ rawChildren }) => {
    let html = `<div class="itemize">`
    parse(rawChildren, {
      row({ rawChildren }) {
        html += `<div class="item"><span class="bullet">&bull;</span>`
        html += `<div class="content">`
        html += parse(rawChildren, {
          ...HtmlFuncMap,
          __block__: divideByParagraphs(p => p),
        })
        html += `</div></div>`
      },
    })
    html += `</div>`
    return html
  },

  pre: ({ args, rawChildren }) => {
    const [lang, _class] = args ? args : [];
    let html = ''
    html += `<div class="pre ${_class ? _class : ""}">`
    html += `<pre><code class="language-${lang}">`
    html += parse(rawChildren, {
      b: HtmlFuncMap.b,
      box: HtmlFuncMap.box,
      __text__: ({ text }) => escape(text),
      __block__: ({ children }) => (children ? children.join('\n') : ''),
      __line__: ({ children }) => (children ? children.join('') : ''),
    })
    html += `</code></pre></div>`
    return html
  },

  code: ({ rawChildren }) => {
    console.log(`code: "${rawChildren}"`)
    return `<span class="code">${escape(rawChildren)}</span>`
  },

  img: ({ rawChildren }) => `<img src="asset/${rawChildren[0]}" />`,

  box: ({ rawChildren }) => `<span class="box">${parse(rawChildren, HtmlFuncMap)}</span>`,

  header: ({ rawChildren }) => {
    let html = `<thead><tr>`
    rawChildren.forEach(ch => {
      html += `<th>${ch.children[0]}</th>`
    })
    html += `</tr></thead>`
    return html
  },

  footnote: ({ args, rawChildren }) => {
    const footnum = `<span class="footnote">${args[0]}</span>`
    if (rawChildren) {
      return `<div class="footnote">${footnum}${parse(rawChildren, {
        ...HtmlFuncMap,
        __block__: divideByParagraphs(p => p),
      })}</div>`
    } else {
      return footnum
    }
  },

  table: ({ args, rawChildren }) => {
    let html = `<div class="table">`
    if (args && args[0] === "left") {
      html += `<table style="text-align: left">`
    } else {
      html += `<table>`
    }
    html += parse(rawChildren, {
      ...HtmlFuncMap,

      code: ({ rawChildren }) => `<span class="code">${escape(rawChildren)}</span>`,
      header: ({ rawChildren }) => rawChildren.split('|').map(h => `<th>${h.trim()}</th>`).join(''),

      __block__: ({ children }) => children.map(row => `<tr>${row}</tr>`).join(''),
      __line__: ({ children }) => children.join('').split('|').map(td => `<td>${td}</td>`).join(''),
    })
    html += `</table>`
    html += `</div>`
    return html
  },

  __text__: ({ text }) => text,
  __line__: ({ children }) => (children ? children.join('') : ''),
  __block__: divideByParagraphs((paragraph) => {
    if (paragraph.startsWith('<div')) {
      return paragraph;
    }
    return `<p>${paragraph}</p>\n`
  }),

  __command__: (node) => `<span class="error">Cmd <code>"${node.id}"</code> not found</span>`,
}

const genHtml = (str) => parse(str, HtmlFuncMap)

module.exports = {
  genHtml
} 
