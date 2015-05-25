var http = require('http');
var concat = require('concat-stream');
var launchTestServer = require('./server');
var test = require('tap').test;
var version = require('../package').version;

test('GET /bookmarks/:existing', function(test) {
  launchTestServer(function(port, callback) {
    var digest = new Array(65).join('a');
    var bookmark = 'shortform';
    var path = '/bookmarks/' + bookmark;
    var postRequest = {method: 'POST', path: path, port: port};
    http.request(postRequest, function(postResponse) {
      test.equal(postResponse.statusCode, 201);
      var getRequest = {method: 'GET', path: path, port: port};
      http.request(getRequest, function(getResponse) {
        getResponse.pipe(concat(function(buffer) {
          test.equal(getResponse.statusCode, 200);
          test.same(JSON.parse(buffer), {
            bookmark: bookmark,
            digest: digest,
            version: version
          });
          callback();
          test.end();
        }));
      }).end();
    }).end(digest);
  });
});

test('GET /bookmarks/:nonexistent', function(test) {
  launchTestServer(function(port, callback) {
    var bookmark = 'notabookmark';
    var path = '/bookmarks/' + bookmark;
    var getRequest = {method: 'GET', path: path, port: port};
    http.request(getRequest, function(getResponse) {
      test.equal(getResponse.statusCode, 404);
      callback();
      test.end();
    }).end();
  });
});
