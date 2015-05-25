var bole = require('bole');
var concat = require('concat-stream');
var http = require('http');
var levelup = require('levelup');
var memdown = require('memdown');

var handler = require('..');
var meta = require('../package.json');

require('tap').test('/', function(test) {
  var level = levelup('', {db: memdown});
  var log = bole('test');
  http.createServer(handler(log, level)).listen(0, function() {
    var server = this;
    http.get({port: server.address().port}, function(response) {
      test.equal(response.statusCode, 200);
      test.equal(response.headers['cache-control'], 'no-store');
      response.pipe(concat(function(buffer) {
        server.close();
        test.same(JSON.parse(buffer), {
          service: meta.name,
          version: meta.version
        });
        test.end();
      }));
    });
  });
});
