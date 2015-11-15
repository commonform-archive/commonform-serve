module.exports = startTestServer

var bole = require('bole')
var handler = require('../')
var http = require('http')
var levelup = require('levelup')
var memdown = require('memdown')
var ws = require('ws')

function startTestServer(callback) {
  var log = bole('test')
  var level = levelup('', { db: memdown })
  var sockets = [ ]
  var sendToSockets = function(message) {
    sockets.forEach(function(socket) {
      socket.send(message) }) }
  level
    .on('put', function(key) {
      sendToSockets(key) })
    .on('batch', function(batch) {
      batch
        .filter(function(operation) {
          return operation.type === 'put' })
        .forEach(function(operation) {
          sendToSockets(operation.key) }) })
  var httpServer = http.createServer(handler(log, level))
  var socketServer = new ws.Server({ server: httpServer })
  socketServer
    .on('connection', function(socket) {
      var index = ( sockets.push(socket) - 1 )
      socket
        .on('close', function() {
          sockets.splice(index, 1) }) })
  httpServer
    .listen(0, function() {
      callback(
        this.address().port,
        this.close.bind(this)) }) }
