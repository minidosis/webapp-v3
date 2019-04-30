
const fatal = (msg) => {
  console.error(msg)
  process.exit(1)
}

class Text {
  constructor() { this.text = ''; }
  add(ch) { this.text += ch; }
  toObj() { return { type: 'text', text: this.text } }
  isEmpty() { return this.text.length === 0 }
}

class Paragraph {
  constructor() {
    this.elems = []; // inline elements
  }

  add(elem) { this.elems.push(elem); }
  isEmpty() { return this.elems.length === 0; }

  toObj() {
    return {
      type: "paragraph",
      children: this.elems.map(e => e.toObj()),
    }
  }
}

class Command {
  toObj() {
    return {
      type: "command",
      id: this.id,
      args: this.args,
      children: this.children,
    }
  }
}

const COMMANDS = {
  code: { raw: true },
}

class Parser {
  constructor(str) {
    this.reset(str);
  }

  reset(str) {
    this.str = str;
    this.lin = this.col = 1;
    this.pos = 0;
    this.all_spaces = true;
  }

  next() {
    if (!this.ok()) {
      return false
    }
    if (this.str[this.pos] == '\n') {
      this.lin++;
      this.col = 1;
      this.all_spaces = true;
    } else {
      this.col++;
    }
    this.pos++
  }

  ok() { return this.pos < this.str.length }
  curr() { return this.str[this.pos] }
  at(ch) { return this.str[this.pos] === ch }

  expect(ch) {
    if (!this.ok() || this.curr() !== ch) {
      throw new Error(`Expected '${ch}'`);
    }
    this.next()
  }

  parseIdent() {
    let start = this.pos
    while (/[a-zA-Z0-9_]/.test(this.curr())) {
      this.next()
    }
    return this.str.slice(start, this.pos)
  }

  parseArgs() {
    this.expect('(')
    let start = this.pos;
    let end = this.str.indexOf(')', start)
    if (end === -1) {
      fatal(`Parse error: missing closing parenthesis`)
    }
    let args = this.str.slice(start, end).split(',').map(x => x.trim())
    this.pos = end;
    this.expect(')')
    return args;
  }

  findMatchingBrace() {

  }

  parseCommand() {
    this.expect('#')
    let cmd = new Command()
    cmd.id = this.parseIdent()
    cmd.args = [];
    if (this.curr() === '(') {
      cmd.args = this.parseArgs()
    }
    this.expect('{')
    if (COMMANDS[cmd.id].raw) {
      /* 
         Esto es más complicado:
         Quizás hacer un parser que pueda tener en cuenta los párrafos o no?? 
         Y usarlo en estos casos??
      */
      cmd.children = /* FIXME: new Text(this.findMatchingBrace()) */
    } else {
      cmd.children = this.parse()
    }
    this.expect('}')
    return cmd
  }

  parse() {
    let tree = []
    let paragraph = new Paragraph()
    let text = new Text()
    let finish = false

    const addPendingText = () => {
      if (!text.isEmpty()) {
        paragraph.add(text)
        text = new Text()
      }
    }

    const addPending = () => {
      addPendingText()
      if (!paragraph.isEmpty()) {
        tree.push(paragraph)
        paragraph = new Paragraph()
      }
    }

    while (this.ok()) {
      switch (this.curr()) {
        case '\n':
          if (this.all_spaces) {
            addPending()
          } else {
            addPendingText()
          }
          this.next()
          break

        case '}':
          finish = true
          break

        case '#':
          if (this.col === 1 && paragraph.isEmpty()) {
            // block command
            addPending()
            tree.push(this.parseCommand())
          } else {
            // inline command
            addPendingText()
            paragraph.add(this.parseCommand())
          }
          break

        default:
          this.all_spaces = false
          text.add(this.curr())
          this.next()
          break
      }
      if (finish) {
        break
      }
    }
    addPending()
    return tree.map(elem => elem.toObj())
  }
}

const parse = (str) => {
  try {
    const parser = new Parser(str);
    return parser.parse()
  } catch (e) {
    return { error: e }
  }
}

const genHtml = (markright, commandObject) => {
  let html = '';

  const genNode = (node) => {
    if (node.type === 'paragraph') {
      if (node.children.length === 1) {
        genNode(node.children[0])
      } else {
        html += '<p>'
        node.children.forEach(genNode)
        html += '</p>'
      }
    } else if (node.type === 'text') {
      html += node.text + '\n'
    } else if (node.type === 'command') {
      html += commandObject[node.id](node.args, node.children)
    }
  }
  markright.forEach(genNode)
  return html;
}

module.exports = {
  parse,
  genHtml,
}


