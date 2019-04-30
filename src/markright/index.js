
class Parser {
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.lin = this.col = 1;
  }

  error(msg) { throw new Error(msg); }

  ok()   { return this.pos < this.input.length }
  curr() { return this.input[this.pos] }
  at(ch) { return this.curr() === ch }

  next() {
    if (!this.ok()) {
      return false
    }
    if (this.curr() == '\n') {
      this.lin++;
      this.col = 1;
    } else {
      this.col++;
    }
    this.pos++
  }

  expect(ch) {
    if (!this.ok() || !this.at(ch)) {
      this.error(`Expected '${ch}'`);
    }
    this.next()
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
    let start = this.pos;
    let end = this.input.indexOf(')', start)
    if (end === -1) {
      this.error(`Parse error: missing closing parenthesis`)
    }
    let args = this.input.slice(start, end).split(',').map(x => x.trim()).filter(x => x.length > 0)
    this.pos = end;
    this.expect(')')
    return args;
  }

  parseCommand() {
    this.expect('#')
    let result = {};
    result.cmd = this.parseIdent()
    if (this.at('(')) {
      let args = this.parseArgs()
      if (args.length > 0) {
        result.args = args
      }
    }
    if (this.at('{')) {
      this.expect('{')
      let text = this.parse()
      this.expect('}')
      if (text.length > 0) {
        result.text = text
      }
    }
    return result
  }

  parse() {
    let result = []
    let text = '';
    let finish = false;
    let newline = false;

    const addPendingText = (add = '') => {
      const allSpaces = /^\s*$/.test(text)
      if (allSpaces && newline) {
        result.push(null)
      } else if (text.length > 0) {
        result.push(text + add)
      }
      text = '';
    }

    while (!finish && this.ok()) {
      switch (this.curr()) {
        case '}':
          finish = true
          break

        case '\n':
          addPendingText()
          this.next()
          newline = true;
          break

        case '#':
          addPendingText()
          result.push(this.parseCommand())
          newline = false
          break

        default:
          text += this.curr()
          this.next()
          break
      }
    }
    if (text.length > 0) {
      addPendingText()
    }
    return result
  }
}

const parse = (str) => new Parser(str).parse()

module.exports = {
  parse
}