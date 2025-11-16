const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/api/devices') {
    const devices = [
      { id: 1, name: 'Temperature Sensor', status: 'online', value: '25°C' },
      { id: 2, name: 'Humidity Sensor', status: 'offline', value: '60%' },
      { id: 3, name: 'Light Sensor', status: 'online', value: '800 lux' }
    ];

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(devices));
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
