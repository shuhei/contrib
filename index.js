var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var PORT = process.env['PORT'] || 3000;
var CONTRIBUTIONS = '/contributions/';
var server = http.createServer();

server.on('request', function (request, response) {
  var parsed = url.parse(request.url);
  var p = parsed.path;
  console.error(p);

  // -- Github Contributions
  if (p.indexOf(CONTRIBUTIONS) === 0) {
    var userName = p.slice(CONTRIBUTIONS.length);
    var contribUrl = 'https://github.com/users/' + userName + '/contributions';
    https.get(contribUrl)
      .on('response', function (res) {
        response.writeHead(res.statusCode, {
          'Content-Type': res.headers['content-type'],
          'Content-Length': res.headers['content-length']
        });
        res.pipe(response);
      })
      .on('error', function (err) {
        console.error(err.message);
        response.statusCode = 500;
        response.end();
      });
    return;
  }

  // -- Static files
  // Malicious path
  if (p.indexOf('..') >= 0) {
    console.error('Potentially malicious path:', p);
    response.statusCode = 403;
    response.end();
    return;
  }

  // index.html
  if (p === '/') p = 'index.html';

  // Serve file.
  fs.createReadStream(path.join(__dirname, 'public', p))
    .on('error', function (err) {
      console.error(err.message);
      response.statusCode = 404;
      response.end();
    })
    .once('readable', function () {
      response.writeHead(200, { 'Content-Type': mime.lookup(p) });
    })
    .pipe(response);
});

server.on('listening', function () {
  console.error('Listening on', PORT);
});

server.listen(PORT);
