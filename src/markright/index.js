
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

  ok()   { return this.pos < this.str.length }
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

  parseCommand() {
    this.expect('#')
    let cmd = new Command()
    cmd.id = this.parseIdent()
    cmd.args = [];
    if (this.curr() === '(') {
      cmd.args = this.parseArgs()
      this.expect(')')
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
          break

        case '}':
          finish = true
          break

        case '#':
          if (this.col == 1) {
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
          break
      }
      if (finish) {
        break
      }
      this.next()
    }
    addPending()
    return tree.map(elem => elem.toObj())
  }
}

let parser = new Parser(`
this is a paragraph #hi{yay #em{wow} !!} hola
#question{
a b c d
e f g h i j
#answer{true}
#answer{false}
P2 sdlkjk lskdflskj 
sdjflskdjfl sk
}
this is another paragraph
`)

console.log(parser.parse())