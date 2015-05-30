var concat = require('concat-stream');
var http = require('http');
var launchTestServer = require('./server');
var path = require('path');
var test = require('tape').test;
var version = require('../package').version;

test('GET /terms/:term/definitions', function(test) {
  launchTestServer(function(port, callback) {
    var form = {content: [{definition: 'Term'}]};
    var postRequest = {method: 'POST', path: '/forms', port: port};
    http.request(postRequest, function(postResponse) {
      test.equal(postResponse.statusCode, 201);
      var digest = path.basename(postResponse.headers.location);
      var searchPath = '/terms/Term/definitions';
      var getRequest = {method: 'GET', path: searchPath, port: port};
      http.request(getRequest, function(getResponse) {
        getResponse.pipe(concat(function(buffer) {
          test.equal(getResponse.statusCode, 200);
          test.same(JSON.parse(buffer), {
            term: 'Term',
            definitions: [{digest: digest, form: form}],
            version: version
          });
          callback();
          test.end();
        }));
      }).end();
    }).end(JSON.stringify(form));
  });
});

test('POST /terms/:term/definitions', function(test) {
  launchTestServer(function(port, callback) {
    var searchPath = '/terms/Term/definitions';
    var getRequest = {method: 'POST', path: searchPath, port: port};
    http.request(getRequest, function(getResponse) {
      test.equal(getResponse.statusCode, 405);
      callback();
      test.end();
    }).end();
  });
});
