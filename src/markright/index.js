
// TODO: Permitir una directiva que cambie el CONTROL_CHARACTER
const CONTROL_CHARACTER = '@'

class Parser {
  constructor(input, commandFuncs) {
    this.input = input
    this.commandFuncs = commandFuncs
    this.pos = 0
    this.lin = this.col = 1
  }

  error(msg) { throw new Error(msg) }

  ok()    { return this.pos < this.input.length }
  curr()  { return this.input[this.pos] }
  at(str) { return this.input.slice(this.pos, this.pos + str.length) === str }

  notAtSpace() { return this.ok() && !/\s/.test(this.curr()) }

  next(n = 1) {
    for (let i = 0; i < n; i++) {
      if (!this.ok()) {
        return false
      }
      if (this.curr() == '\n') {
        this.lin++
        this.col = 1
      } else {
        this.col++
      }
      this.pos++
    }
  }

  expect(str) {
    if (!this.ok() || !this.at(str)) {
      this.error(`Expected '${str}'`);
    }
    this.next(str.length)
  }

  parseIdent() {
    let start = this.pos
    while (this.ok() && /[a-zA-Z0-9_]/.test(this.curr())) {
      this.next()
    }
    return this.input.slice(start, this.pos)
  }

  parseArgs() {
    this.expect('(')
    let start = this.pos
    let end = this.input.indexOf(')', start)
    if (end === -1) {
      this.error(`Parse error: missing closing parenthesis`)
    }
    let args = this.input.slice(start, end).split(',').map(x => x.trim()).filter(x => x.length > 0)
    this.pos = end
    this.expect(')')
    return args
  }

  parseOpenDelimiter() {
    const D = "{}[]<>"
    const opD = [...D].filter((_, i) => i % 2 == 0).join('')

    const isOpenDelim = ch => opD.indexOf(ch) !== -1
    const makeInverseDelim = str => [...str].reverse().map(x => D[D.indexOf(x)+1]).join('')

    let delim = ''
    while (isOpenDelim(this.curr())) {
      delim += this.curr()
      this.next()
    }
    return (delim.length === 0 ? null : {
      open: delim,
      close: makeInverseDelim(delim),
    })
  }

  parseCommand() {
    this.expect(CONTROL_CHARACTER)
    let result = {}
    result.id = this.parseIdent()
    if (this.at('(')) {
      let args = this.parseArgs()
      if (args.length > 0) {
        result.args = args
      }
    }
    let delim = this.parseOpenDelimiter();
    if (delim) {
      let children = this.parse(delim.close)
      this.expect(delim.close)
      if (children.length > 0) {
        result.children = children
      }
    }
    return result
  }

  parse(closeDelim) {
    let result = []
    let text = '';
    let newline = false;

    const lastIsCommand = () => {
      const i = result.length - 1;
      return i >= 0 && result[i] !== null && typeof result[i] === 'object';
    }

    const addPendingText = () => {
      if (text.length > 0) {
        result.push(text)
      }
      text = '';
    }

    // TODO: Quitar líneas vacías del principio y del final

    while (this.ok()) {
      if (closeDelim && this.at(closeDelim)) {
        break
      }
      if (this.at(CONTROL_CHARACTER + CONTROL_CHARACTER)) {
        text += CONTROL_CHARACTER
        this.next(2)
      }
      else if (this.at(CONTROL_CHARACTER)) {
        addPendingText()
        let cmd = this.parseCommand()
        if (this.commandFuncs && cmd.id in this.commandFuncs) {
          cmd = this.commandFuncs[cmd.id](cmd)
        }
        result.push(cmd)
        newline = false
      } 
      else if (this.at('\n')) {
        this.next()
        if (this.at(CONTROL_CHARACTER)) {
          // put a space separator when a command starts at beginning of line
          text += ' ' 
        }
        const allSpaces = /^\s*$/.test(text)
        if (allSpaces && newline) {
          result.push(null)
          text = ''
        } else {  
          addPendingText()
        }
        newline = true;
        if (this.notAtSpace() && lastIsCommand()) {
          // Meter un espacio entre un comando a final de línea y el texto que le sigue
          text += ' '
        }
      } else {
        text += this.curr()
        this.next()
      }
    }
    addPendingText()
    return result
  }
}

const parse = (str, commandFuncs) => {
  try {
    const parser = new Parser(str, commandFuncs);
    return parser.parse()
  } catch (e) {
    console.log("Error parsing markright:", e)
    return { error: e }
  }
}

const genHtml = (markright, context, commandFuncs) => {
  // Hasta que no veamos un null, el texto es 'inline'
  // En el momento que vemos un null, entonces pasamos a usar '<p>' 
  let html = '', paragraph = '', lastWasText = false, inline = true;
  for (let node of markright) {
    if (typeof node === 'string') {
      if (commandFuncs && '<text>' in commandFuncs) {
        node = commandFunds['<text>']({ node, context })
      }
      paragraph += (lastWasText ? '\n' : '') + node
    } else if (node == null) {
      inline = false;
      html += `<p>${paragraph}</p>\n`
      paragraph = ''
    } else if (typeof node === 'object') {
      if (commandFuncs && node.id in commandFuncs) {
        paragraph += commandFuncs[node.id]({ ...node, context })
      } else {
        paragraph += `<span class="error">Command <b>${node.id}</b> not found</span>`
      }
    } else {
      throw new Error(`genHtml: unrecognized type of node`)
    }
    lastWasText = (typeof node === 'string')
  }
  if (inline) {
    return paragraph;
  }
  if (paragraph.length > 0) {
    html += `<p>${paragraph}</p>\n`
  }
  return html
}

module.exports = {
  parse,
  genHtml,
}