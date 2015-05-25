var bole = require('bole');
var handler = require('..');
var http = require('http');
var levelup = require('levelup');
var memdown = require('memdown');
var sinon = require('sinon');
var test = require('tap').test;

test('GET /forms/:digest databsae error', function(test) {
  var level = levelup('', {db: memdown});
  var log = bole('test');
  var mock = sinon.mock(level);
  mock.expects('get').yields('Error');
  http.createServer(handler(log, level)).listen(0, function() {
    var server = this;
    var port = server.address().port;
    var request = {path: '/forms/x', port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 500);
      mock.verify();
      server.close();
      test.end();
    }).end();
  });
});

test('POST /forms database error', function(test) {
  var level = levelup('', {db: memdown});
  var log = bole('test');
  var mock = sinon.mock(level);
  mock.expects('batch').yields('Error');
  http.createServer(handler(log, level)).listen(0, function() {
    var server = this;
    var port = server.address().port;
    var form = {content:['test']};
    var request = {method: 'POST', path: '/forms', port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 500);
      mock.verify();
      server.close();
      test.end();
    }).end(JSON.stringify(form));
  });
});

test('POST /bookmarks/:bookmark database error', function(test) {
  var level = levelup('', {db: memdown});
  var log = bole('test');
  var mock = sinon.mock(level);
  mock.expects('batch').yields('Error');
  http.createServer(handler(log, level)).listen(0, function() {
    var server = this;
    var port = server.address().port;
    var digest = new Array(65).join('a');
    var request = {method: 'POST', path: '/bookmarks/t', port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 500);
      mock.verify();
      server.close();
      test.end();
    }).end(digest);
  });
});

test('GET /bookmarks/:bookmark database error', function(test) {
  var level = levelup('', {db: memdown});
  var log = bole('test');
  var mock = sinon.mock(level);
  mock.expects('get').yields('Error');
  http.createServer(handler(log, level)).listen(0, function() {
    var server = this;
    var port = server.address().port;
    var request = {method: 'GET', path: '/bookmarks/t', port: port};
    http.request(request, function(response) {
      test.equal(response.statusCode, 500);
      mock.verify();
      server.close();
      test.end();
    }).end();
  });
});
