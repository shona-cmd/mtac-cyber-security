const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/devices') {
    const devices = [
      { id: 1, name: 'Temperature Sensor', status: 'online', value: 25 },
      { id: 2, name: 'Humidity Sensor', status: 'offline', value: 60 },
      { id: 3, name: 'Motion Detector', status: 'online', value: 1 },
    ];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(devices));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
