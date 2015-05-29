var concat = require('concat-stream');
var http = require('http');
var launchTestServer = require('./server');
var path = require('path');
var test = require('tape').test;

test('GET /digests?prefix=:prefix', function(test) {
  launchTestServer(function(port, callback) {
    var form = {content:['valid form']};
    var postRequest = {method: 'POST', path: '/forms', port: port};
    http.request(postRequest, function(postResponse) {
      test.equal(postResponse.statusCode, 201);
      var digest = path.basename(postResponse.headers.location);
      var digestPath = '/digests?prefix=' + digest.slice(0, 2);
      var getRequest = {method: 'GET', path: digestPath, port: port};
      http.request(getRequest, function(getResponse) {
        getResponse.pipe(concat(function(buffer) {
          test.equal(getResponse.statusCode, 200);
          test.same(JSON.parse(buffer), [digest]);
          callback();
          test.end();
        }));
      }).end();
    }).end(JSON.stringify(form));
  });
});

test('POST /digests', function(test) {
  launchTestServer(function(port, callback) {
    var postRequest = {method: 'POST', path: '/digests', port: port};
    http.request(postRequest, function(postResponse) {
      test.equal(postResponse.statusCode, 405);
      callback();
      test.end();
    }).end();
  });
});
