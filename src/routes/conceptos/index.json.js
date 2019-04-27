import { graph } from '../../graph';

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

  const nodes = [];
  graph.forEachNode((id, { title }) => {
    nodes.push({ id, title })
  })

	res.end(JSON.stringify(nodes));
}