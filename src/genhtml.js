
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

class HtmlFuncMap {

  minidosis(args, children) { return `<a href="${"id/" + args[0]}">${parse(children, this)}</a>` }
  a(args, children) { return `<a href="${args[0]}">${parse(children, this)}</a>` }
  b(_, children) { return `<b>${parse(children, this)}</b>` }
  em(_, children) { return `<em>${parse(children, this)}</em>` }
  h2(_, children) { return `<h2>${parse(children, this)}</h2>` }

  olist(_, children) {
    let html = `<div class="enumerate">`
    let funcMap = this
    let num = 1
    parse(children, {
      row(_, children) {
        html += `<div class="item"><span class="num">${num}</span>`
        html += `<div class="content">`
        html += parse(children, funcMap)
        html += `</div></div>`
        num++
      },
    })
    html += `</div>`
    console.log(html)
    return html
  }

  ulist(_, children) {
    let html = `<div class="itemize">`
    let funcMap = this
    parse(children, {
      row(_, children) {
        html += `<div class="item"><span class="bullet">&bull;</span>`
        html += `<div class="content">`
        html += parse(children, funcMap)
        html += `</div></div>`
      },
    })
    html += `</div>`
    return html
  }

  pre(args, children) {
    const [lang, _class] = args ? args : [];
    let html = ''
    html += `<div class="pre ${_class ? _class : ""}">`
    html += `<pre><code class="language-${lang}">`
    html += parse(children, {
      b: this.b,
      box: this.box,
      __block__(children) { return children ? children.join('\n') : '' },
      __line__(children) { return children ? children.join('') : '' },
      __text__(text) { return escape(text) },
    })
    html += `</code></pre></div>`
    return html
  }

  code(_, children) {
    return `<span class="code">${escape(parse(children, this))}</span>`
  }

  img(_, children) { return `<img src="asset/${children[0]}" />` }

  box(_, children) {
    return `<span class="box">${parse(children, this)}</span>`
  }

  header(_, children) {
    let html = `<thead><tr>`
    console.log("header", children)
    children.forEach(ch => {
      html += `<th>${ch.children[0]}</th>`
    })
    html += `</tr></thead>`
    return html
  }

  footnote(args, children) {
    const footnum = `<span class="footnote">${args[0]}</span>`
    if (children) {
      return `<div class="footnote">${footnum}${parse(children, this)}</div>`
    } else {
      return footnum
    }
  }

  table(args, children) {
    const funcMap = this
    let html = `<div class="table">`
    if (args && args[0] === "left") {
      html += `<table style="text-align: left">`
    } else {
      html += `<table>`
    }
    html += parse(children, {
      __block__(children) {
        return children.map(row => `<tr>${row}</tr>`).join('')
      },
      header(_, children) {
        return children[0].split('|').map(h => `<th>${h.trim()}</th>`).join('')
      },
      __line__(children) {
        return children[0].text.split('|').map(s => `<td>${s.trim()}</td>`).join('')
      }
    })
    html += `</table>`
    html += `</div>`
    console.log(html)
    return html
  }

  __text__(text) { return text }
  __line__(children) { return (children ? children.join('') : '') }
  __block__(children) { return children ? children.join('\n') : '' }

  __command__(node) { return `<span class="error">Cmd <code>"${node.id}"</code> not found</span>` }
}

const genHtml = (str) => parse(str.split('\n'), new HtmlFuncMap())

module.exports = {
  genHtml
} 
