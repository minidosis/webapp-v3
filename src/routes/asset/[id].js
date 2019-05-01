import fs from 'fs';
import { graph } from '../../graph';


export function get(req, res) {
  const { id } = req.params;

  if (graph.hasImage(id)) {
    const imagePath = graph.getImage(id)
    var imgData = fs.readFileSync(imagePath);
    res.writeHead(200, {
      'Content-Type': 'image/jpg' 
    });
    res.end(imgData, 'binary');
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
