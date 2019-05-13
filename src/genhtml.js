
const markright = require('@minidosis/markright')

const escape = (text) => {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    switch (text[i]) {
      case '<': result += '&lt;'; break;
      case '>': result += '&gt;'; break;
      default:  result += text[i]; break;
    }
  }
  return result
}

class HtmlGenerator extends markright.Generator {

  __command__(node) {
    this.add(`<span class="error">Cmd <code>"${node.id}"</code> not found</span>`)
  }

  __text__(text) {
    if (this.in('pre') || this.in('code')) {
      this.add(escape(text))
    } else {
      this.add(text)
    }
  }

  __paragraph__(paragraph) {
    return paragraph.join('')
  }

  __doc__(doc) {
    if (this.in('pre')) {
      return doc.join('\n')
    } else {
      return doc.map(p => `<p>${p}</p>`).join('\n')
    }
  }

  minidosis({ args, children }) {
    this.add(`<a href="${"id/" + args[0]}">${this.generate(children)}</a>`)
  }

  a({ args, children }) {
    this.add(`<a href="${args[0]}">${this.generate(children)}</a>`)
  }

  b({ children }) {
    this.add(`<b>${this.generate(children)}</b>`)
  }

  em({ children }) {
    this.add(`<em>${this.generate(children)}</em>`)
  }

  h2({ children }) {
    this.add(`<h2>${this.generate(children)}</h2>`)
  }

  olist({ args, children }) {
    let html = `<div class="enumerate">`;
    let num = 1;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child && typeof child === "object") {
        html += `<div class="item">
          <span class="num">${num}</span>
          <div class="content">${this.generate(child.children)}</div>
        </div>`
        num++;
      }
    }
    html += `</div>`;
    this.add(html);
  }

  ulist({ args, children }) {
    let html = `<div class="itemize">`;
    let num = 1;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child && typeof child === "object" && child.id == "") {
        html += `<div class="item">
          <span class="bullet">&bull;</span>
          <div class="content">${this.generate(child.children)}</div>
        </div>`
        num++;
      }
    }
    html += `</div>`;
    this.add(html);
  }

  pre({ args, children }) {
    const [lang, _class] = args ? args : [];
    this.add(`<div class="pre ${_class ? _class : ""}"><pre>${this.generate(children)}</pre></div>`)
  }

  code({ args, children }) {
    this.add(`<span class="code">${this.generate(children)}</span>`)
  }

  img({ children }) {
    this.add(`<img src="asset/${children[0]}" />`)
  }

  box({ children }) {
    this.add(`<span class="box">${this.generate(children)}</span>`)
  }

  header({ children }) {
    this.add(`<thead><tr>${
      children.map(ch => `<th>${ch.children[0]}</th>`).join("")
    }</tr></thead>`)
  }

  row({ children }) {
    this.add(`<tr>${children.map(ch => `<td>${this.generate(ch.children)}</td>`).join("")}</tr>`)
  }

  footnote({ args, children }) {
    const footnum = `<span class="footnote">${args[0]}</span>`;
    this.add(children
      ? `<div class="footnote">${footnum}${this.generate(children)}</div>`
      : footnum)
  }


  table({ args, children }) {
    let align;
    if (args && args[0] === "left") {
      align = "left";
    }
    this.add(`<div class="table">
      <table ${align ? `style="text-align: ${align}"` : ``}>
        ${genHtml(children)}
      </table>
    </div>`)
  }

  comment() { }
}

const genHtml = (mr) => {
  const G = new HtmlGenerator();
  return G.generate(mr)
}

module.exports = {
  genHtml
} 
