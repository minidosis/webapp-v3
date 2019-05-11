import { graph } from '@minidosis/graph';

export function get(req, res) {
	// the `id` parameter is available because
	// this file is called [id].json.js
  const { id } = req.params;
  
  if (graph.has(id)) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
    });
		res.end(graph.get(id).toJson());
  } 
  else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `No he encontrado el nodo ${id}`
		}));
  }
}
