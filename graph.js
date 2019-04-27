
const fs = require('fs');

const fatal = (msg) => {
  console.error(msg)
  process.exit(1)
}

const fileContent = (filename) => String(fs.readFileSync(filename))

const findPairedBrace = (str, pos) => {
  if (str[pos] !== '{') {
    return -1;
  }
  let open = 1;
  while (++pos < str.length) {
    if (str[pos] === '{') {
      open++;
    } else if (str[pos] === '}') {
      open--;
    }
    if (open == 0) {
      return pos;
    }
  }
  return -1;
}

const fileHeader = (filename) => {
  const content = fileContent(filename)
  const end = findPairedBrace(content, 0);
  return (end === -1 ? [] : content.slice(0, end+1));
}

const isSpace = (ch) => /\s/.test(ch)

const skipSpaces = (str, pos) => {
  while (pos < str.length && isSpace(str[pos])) {
    pos++;
  }
  return pos;
}

const parseString = (str, pos) => {
  const inipos = pos;
  if (str[pos] !== '"') {
    fatal(`Parse error: Expected '"' at start of string`)
  }
  pos++;
  while (pos < str.length) {
    if (str[pos] == '\\') {
      pos++;
    } else if (str[pos] == '"') {
      return { str: str.slice(inipos+1, pos), pos }
    }
    pos++;
  }
  fatal(`Parse error: unterminated string`)
}

const parseTree = (str, pos) => {
  let end = findPairedBrace(str, pos);
  if (end == -1) {
    fatal(`Parse error: Expected '{' at start of tree: "${str}"`)
  }
  let tree = {}, list = [];
  let label = null, symbol = '';

  const add = (item) => {
    if (label !== null) {
      tree[label] = item;
      label = null;
    } else {
      list.push(item);
    }
  }

  pos = skipSpaces(str, pos+1)
  while (pos < end) {
    const curr = str[pos];
    if (curr == '"') {
      let { str: child, pos: new_pos } = parseString(str, pos);
      add(child)
      pos = new_pos + 1;
    } 
    else if (curr == '{') {
      let { tree: child, pos: new_pos } = parseTree(str, pos)
      add(child)
      pos = new_pos + 1;
    } 
    else if (curr === ':') {
      if (label !== null) {
        fatal(`Parse error: two labels in a row`)
      }
      label = symbol;
      symbol = '';
      pos = skipSpaces(str, pos+1)
    } 
    else if (isSpace(curr)) {
      if (symbol.length > 0) {
        add(symbol)
        symbol = ''
      }
      pos = skipSpaces(str, pos)
    } 
    else {
      symbol += curr;
      pos++;
    }
  }
  const nprops = Object.keys(tree).length
  if (nprops > 0 && list.length > 0) {
    fatal(`A {} is both an object and a list!`)
  }
  return { tree: (nprops > 0 ? tree : list), pos }
}

const parseHeader = (header) => parseTree(header, 0).tree

const GRAPH_DIR = './graph'

let minidosis_files = fs.readdirSync(GRAPH_DIR).filter(file => file.endsWith('.minidosis'))

for (let file of minidosis_files) {
  const full_path = GRAPH_DIR + '/' + file;
  const header = fileHeader(full_path)
  // console.log(header)
  console.log(parseHeader(header))
}
