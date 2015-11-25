var bole = require('bole')
var handler = require('../')
var http = require('http')
var levelup = require('levelup')
var memdown = require('memdown')

module.exports = startTestServer

function startTestServer(callback, port) {
  port = ( port || 0 )
  var log = bole('test')
  if (port !== 0) {
    bole.output([
      { level: 'debug', stream: process.stdout },
      { level: 'info', stream: process.stdout },
      { level: 'warn', stream: process.stdout },
      { level: 'error', stream: process.stdout } ]) }
  var level = levelup('', { db: memdown })
    http.createServer(handler(log, level))
      .listen(port, function() {
        callback(
          this.address().port,
          this.close.bind(this)) }) }

if (!module.parent) {
  startTestServer(
    function(port) {
      console.log('Listening on port ' + port) },
    8080) }
