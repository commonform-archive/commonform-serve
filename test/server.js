var bole = require('bole');
var http = require('http');
var levelup = require('levelup');
var memdown = require('memdown');

var handler = require('..');

// Start a test server.
function startTestServer(callback) {
  var log = bole('test');
  var level = levelup('', {db: memdown});
  // Request port 0 so the OS will bind a random high port.
  http.createServer(handler(log, level)).listen(0, function() {
    // Identify the random port and pass it down for use in the test.
    callback(this.address().port, this.close.bind(this));
  });
}

module.exports = startTestServer;
