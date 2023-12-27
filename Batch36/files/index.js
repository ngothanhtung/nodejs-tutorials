const http = require('http');
const fs = require('fs');
const { error } = require('console');
http
  .createServer(function (req, res) {
    fs.readFile('demohtml.html', function (err, data) {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('404 Not Found');
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      return res.end();
    });
  })
  .listen(3000);
