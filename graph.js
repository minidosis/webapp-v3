
const { parseAllFiles } = require('./parser')

const GRAPH_DIR = './graph'

parseAllFiles(GRAPH_DIR, (filename, header) => {
  console.log(filename, header)
})