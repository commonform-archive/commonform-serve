var concat = require('concat-stream');
var http = require('http');
var launchTestServer = require('./server');
var path = require('path');
var test = require('tap').test;
var version = require('../package').version;

test('GET /forms/:nonexistent', function(test) {
  launchTestServer(function(port, callback) {
    var request = {method: 'GET', path: '/forms/x', port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 404);
      callback();
      test.end();
    }).end();
  });
});

test('GET /forms/:existing', function(test) {
  launchTestServer(function(port, callback) {
    var form = {content:['Test']};
    var postRequest = {method: 'POST', path: '/forms', port: port};
    http.request(postRequest, function(response) {
      test.equal(response.statusCode, 201);
      test.equal(typeof response.headers.location, 'string');
      var digest = path.basename(response.headers.location);
      var getRequest = {path: response.headers.location, port: port};
      http.request(getRequest, function(response) {
        test.equal(response.statusCode, 200);
        response.pipe(concat(function(buffer) {
          test.deepEqual(JSON.parse(buffer), {
            digest: digest,
            form: form,
            version: version
          });
          callback();
          test.end();
        }));
      }).end();
    }).end(JSON.stringify(form));
  });
});
