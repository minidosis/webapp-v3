
const { parse, parseRecur } = require('@minidosis/markright')

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

class HtmlFuncMap {

  minidosis({ args, rawChildren }) {
    return `<a href="${"id/" + args[0]}">${parse(rawChildren, this)}</a>`
  }

  a({ args, rawChildren }) { return `<a href="${args[0]}">${parse(rawChildren, this)}</a>` }
  b({ rawChildren }) { return `<b>${parse(rawChildren, this)}</b>` }
  em({ rawChildren }) { return `<em>${parse(rawChildren, this)}</em>` }
  h2({ rawChildren }) { return `<h2>${parse(rawChildren, this)}</h2>` }

  olist({ rawChildren }) {
    let html = `<div class="enumerate">`
    let funcMap = this
    let num = 1
    parse(rawChildren, {
      row({ rawChildren }) {
        html += `<div class="item"><span class="num">${num}</span>`
        html += `<div class="content">`
        html += parse(rawChildren, funcMap)
        html += `</div></div>`
        num++
      },
    })
    html += `</div>`
    console.log(html)
    return html
  }

  ulist({ rawChildren }) {
    let html = `<div class="itemize">`
    let funcMap = this
    parse(rawChildren, {
      row({ rawChildren }) {
        html += `<div class="item"><span class="bullet">&bull;</span>`
        html += `<div class="content">`
        html += parse(rawChildren, funcMap)
        html += `</div></div>`
      },
    })
    html += `</div>`
    return html
  }

  pre({ args, rawChildren }) {
    const [lang, _class] = args ? args : [];
    let html = ''
    html += `<div class="pre ${_class ? _class : ""}">`
    html += `<pre><code class="language-${lang}">`
    html += parse(rawChildren, {
      b: this.b,
      box: this.box,
      __text__: ({ text }) => escape(text),
      __block__: ({ children }) => (children ? children.join('\n') : ''),
      __line__: ({ children }) => (children ? children.join('') : ''),
    })
    html += `</code></pre></div>`
    return html
  }

  code({ rawChildren }) {
    return `<span class="code">${escape(parse(rawChildren, this))}</span>`
  }

  img({ rawChildren }) { return `<img src="asset/${rawChildren[0]}" />` }

  box({ rawChildren }) {
    return `<span class="box">${parse(rawChildren, this)}</span>`
  }

  header({ rawChildren }) {
    let html = `<thead><tr>`
    console.log("header", rawChildren)
    rawChildren.forEach(ch => {
      html += `<th>${ch.children[0]}</th>`
    })
    html += `</tr></thead>`
    return html
  }

  footnote({ args, rawChildren }) {
    const footnum = `<span class="footnote">${args[0]}</span>`
    if (rawChildren) {
      return `<div class="footnote">${footnum}${parse(rawChildren, this)}</div>`
    } else {
      return footnum
    }
  }

  table({ args, rawChildren }) {
    const funcMap = this
    let html = `<div class="table">`
    if (args && args[0] === "left") {
      html += `<table style="text-align: left">`
    } else {
      html += `<table>`
    }
    html += parse(rawChildren, {
      __text__: funcMap.__text__,
      // TODO: Aquí hay que duplicar el 'code' sin hacer parse porque no funciona bien...
      code({ rawChildren }) {
        return `<span class="code">${escape(rawChildren)}</span>`
      },
      __block__({ children }) {
        return children.map(row => `<tr>${row}</tr>`).join('')
      },
      header({ rawChildren }) {
        return rawChildren.split('|').map(h => `<th>${h.trim()}</th>`).join('')
      },
      __line__({ children }) {
        return children.join('').split('|').map(td => `<td>${td}</td>`).join('')
      }
    })
    html += `</table>`
    html += `</div>`
    return html
  }

  __text__({ text }) { return text }
  __line__({ children }) { return (children ? children.join('') : '') }
  __block__({ children }) { return children ? children.join('\n') : '' }

  __command__(node) { return `<span class="error">Cmd <code>"${node.id}"</code> not found</span>` }
}

const genHtml = (str) => parse(str, new HtmlFuncMap())

module.exports = {
  genHtml
} 
