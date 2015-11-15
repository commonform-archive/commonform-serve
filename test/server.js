var bole = require('bole')
var handler = require('../')
var http = require('http')
var levelup = require('levelup')
var memdown = require('memdown')

module.exports = startTestServer

function startTestServer(callback) {
  var log = bole('test')
  var level = levelup('', { db: memdown })
  http.createServer(handler(log, level))
    .listen(0, function() {
      callback(
        this.address().port,
        this.close.bind(this)) }) }
