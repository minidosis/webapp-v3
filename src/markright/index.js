
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
      fatal(`Expected '${ch}'`);
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

  parseCommand() {
    this.expect('#')
    let cmd = new Command()
    cmd.id = this.parseIdent()
    cmd.args = [];
    if (this.curr() === '(') {
      cmd.args = this.parseArgs()
    }
    this.expect('{')
    cmd.children = this.parse()
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

/*
function test() {
  let test1 = `
En un lenguaje de programación, una expresión es una fórmula que
calcula un valor a partir de otros. La expresión representa un cálculo,
y produce un solo resultado a partir de varios operandos.

Las expresiones se denominan #minidosis(unary-expression){unarias} si reciben
solamente un valor de entrada y #minidosis(binary-expression){binarias} si reciben dos.
En #minidosis(c-lang){C} y #minidosis(cpp-lang){C++} existen un tipo especial de 
#minidosis(c-ternary-expression){expresión ternaria}, con 3 operandos.
`

  let test2 = `
this is a paragraph #hi{yay #em{wow} !!} hola
#question{
a b c d
e f g h i j
#answer{true
true}
#answer{false}
P2 sdlkjk lskdflskj 
sdjflskdjfl sk
}
this is another paragraph
`

  let parser = new Parser(test1)
  console.log(parser.parse())
}
*/

const parse = (str) => new Parser(str).parse()

const genHtml = (markright, commandObject) => {
  let html = '';

  const genNode = (node) => {
    let html;
    if (node.type === 'text') {
      html = node.text + " ";
    } else if (node.type === 'command') {
      html = commandObject[node.id](node.args, node.children)
    }
    return html;
  }

  markright.forEach(node => {
    if (node.type === 'paragraph') {
      if (node.children.length === 1) {
        html += genNode(node.children[0]).trim()
      } else {
        html += '<p>'
        html += node.children.map(genNode).join(' ')
        html += '</p>'
      }
    }
  })

  return html;
}

module.exports = {
  parse,
  genHtml,
}


