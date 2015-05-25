var http = require('http');
var launchTestServer = require('./server');
var test = require('tap').test;

test('POST /forms with a valid form', function(test) {
  launchTestServer(function(port, callback) {
    var form = {content:['Some content']};
    var request = {method: 'POST', path: '/forms', port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 201);
      callback();
      test.end();
    }).end(JSON.stringify(form));
  });
});

test('POST /forms with an invalid form', function(test) {
  launchTestServer(function(port, callback) {
    var form = {content:[]};
    var request = {method: 'POST', path: '/forms', port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 400);
      callback();
      test.end();
    }).end(JSON.stringify(form));
  });
});

test('POST /forms with invalid JSON', function(test) {
  launchTestServer(function(port, callback) {
    var request = {method: 'POST', path: '/forms', port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 400);
      callback();
      test.end();
    }).end('}');
  });
});
