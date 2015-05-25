var bole = require('bole');
var http = require('http');
var levelup = require('levelup');
var memdown = require('memdown');

var handler = require('..');

function setupTestServer(callback) {
  var level = levelup('', {db: memdown});
  var log = bole('test');
  http.createServer(handler(log, level)).listen(0, function() {
    callback(this.address().port, this.close.bind(this));
  });
}

module.exports = setupTestServer;
