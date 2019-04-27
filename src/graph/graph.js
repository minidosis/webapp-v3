
const { parseAllFiles } = require('./parser')

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
}

class Graph {
  constructor() {
    this.nodes = new Map();
  }

  get(id) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, new Node(id))
    }
    return this.nodes.get(id);
  }

  forEachNode(callback) {
    this.nodes.forEach(callback);
  }

  addNode(id, { title, bases, children, related }) {
    const node = this.get(id);
    node.title = title

    const add_links = (links, type, inverseType) => {
      if (links) {
        node.addLinks(type, links)
        links.forEach(other => this.get(other).addLink(inverseType, id))
      }
    }

    add_links(bases,    LinkType.Base,    LinkType.Derived)
    add_links(children, LinkType.Child,   LinkType.Parent)
    add_links(related,  LinkType.Related, LinkType.Related)
  }

  show() {
    this.nodes.forEach(node => node.show())
  }
}

const graph = new Graph();
parseAllFiles(GRAPH_DIR, (minidosisName, header) => {
  graph.addNode(minidosisName, header)
})

module.exports = {
  graph
}
