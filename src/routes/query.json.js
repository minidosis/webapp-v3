import { graph } from '@minidosis/graph';

export function post(req, res) {
  let query = ''

  const doQuery = () => {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(graph.search(query)));
  }
  
  req.on('data', data => query += data)
  req.on('end', doQuery)
}
