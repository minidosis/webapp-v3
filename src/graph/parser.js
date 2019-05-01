
const fs = require('fs');

const error = (msg) => { throw new Error(msg) }

const readFile = (filename) => String(fs.readFileSync(filename))

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

const splitHeader = (filename) => {
  const str = readFile(filename)
  const end = findPairedBrace(str, 0);
  return {
    header: (end === -1 ? [] : str.slice(0, end+1)),
    content: str.slice(end+1),
  }
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
    error(`Parse error: Expected '"' at start of string`)
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
  error(`Parse error: unterminated string`)
}

const parseTree = (str, pos) => {
  let end = findPairedBrace(str, pos);
  if (end == -1) {
    error(`Parse error: Expected '{' at start of tree: "${str}"`)
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
        error(`Parse error: two labels in a row`)
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
    error(`A {} is both an object and a list!`)
  }
  return { tree: (nprops > 0 ? tree : list), pos }
}

const parseHeader = (header) => parseTree(header, 0).tree

const minidosisName = (filename) => filename.split('.')[0]

const parseFile = (dir, file, callback) => {
  const full_path = dir + '/' + file;
  const { header, content } = splitHeader(full_path)
  callback(file, minidosisName(file), parseHeader(header), content)
}

const parseAllFiles = (dir, callback) => {
  let minidosis_files = fs.readdirSync(dir).filter(file => file.endsWith('.minidosis'))

  for (let file of minidosis_files) {
    parseFile(dir, file, callback)
  }
}

module.exports = {
  parseFile,
  parseAllFiles
}