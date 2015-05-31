var http = require('http');
var launchTestServer = require('./server');
var test = require('tape').test;

test('GET /swagger.json', function(test) {
  launchTestServer(function(port, callback) {
    var path = '/swagger.json';
    var request = {method: 'GET', path: path, port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 200);
      callback();
      test.end();
    }).end();
  });
});

test('POST /swagger.json', function(test) {
  launchTestServer(function(port, callback) {
    var request = {method: 'POST', path: '/swagger.json', port: port};
    http.get(request, function(response) {
      test.equal(response.statusCode, 405);
      callback();
      test.end();
    });
  });
});
