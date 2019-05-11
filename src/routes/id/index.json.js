import { graph } from '@minidosis/graph';

export function get(req, res) {
  const nodes = [];
  graph.forEachNode((id, { title }) => {
    if (title) {
      nodes.push({ id, title })
    }
  })
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({ nodes }));
}