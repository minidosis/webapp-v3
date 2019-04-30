
const fs = require('fs')
const { parseAllFiles } = require('./parser')
const { parse: parseMarkright } = require('../markright')

const GRAPH_DIR = './graph'

const LinkTypeArray = ['None', 'Base', 'Derived', 'Child', 'Parent', 'Related']
const listName = {
  Base: 'bases', Derived: 'derived',
  Child: 'children', Parent: 'parents',
  Related: 'related',
}
const LinkType = LinkTypeArray.reduce((typ, val) => { typ[val] = val; return typ; }, {})

class Node {
  constructor(id) {
    this.id = id
    this.links = new Map()
  }
  addLink(type, id) { this.links.set(id, type) }
  addLinks(type, idlist) { idlist.forEach(id => this.addLink(type, id)) }

  show() {
    const $ = (s) => console.log(s)
    const links = { Base: [], Child: [], Related: [] }
    this.links.forEach((type, id) => {
      if (type in links) {
        links[type].push(id)
      }
    })

    $(`${this.id} {`)
    if (this.title) {
      $(`  title: "${this.title}"`)
    }
    for (let idlist in links) {
      if (links[idlist].length > 0) {
        $(`  ${listName[idlist]}: { ${links[idlist].join(' ')} }`)
      }
    }
    $(`}\n`)
  }

  toJson() {
    const node = { id: this.id, title: this.title, content: this.content };
    for (let type in LinkType) {
      node[listName[type]] = [];
    }
    this.links.forEach((type, id) => {
      node[listName[type]].push({ id, title: graph.get(id).title })
    })
    return JSON.stringify(node);
  }
}

class Graph {
  constructor() {
    this.nodes = new Map();
  }

  has(id) { return this.nodes.has(id); }

  get(id) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, new Node(id))
    }
    return this.nodes.get(id);
  }

  forEachNode(callback) {
    this.nodes.forEach((node, id) => callback(id, node));
  }

  numNodes() {
    return this.nodes.size;
  }

  addNode(id, { title, bases, children, related }, content) {
    const node = this.get(id);
    node.title = title
    node.content = content

    const add_links = (links, type, inverseType) => {
      if (links) {
        node.addLinks(type, links)
        links.forEach(other => this.get(other).addLink(inverseType, id))
      }
    }

    add_links(bases, LinkType.Base, LinkType.Derived)
    add_links(children, LinkType.Child, LinkType.Parent)
    add_links(related, LinkType.Related, LinkType.Related)
  }

  show() {
    this.nodes.forEach(node => node.show())
  }

  read() {
    parseAllFiles(GRAPH_DIR, (minidosisName, header, contentString) => {
      const content = parseMarkright(contentString)
      this.addNode(minidosisName, header, content)
    })
  }
}

const graph = new Graph()
graph.read()

fs.watch(GRAPH_DIR, (eventType, filename) => {
  graph.read()
})

module.exports = {
  graph
}

