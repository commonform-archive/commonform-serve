var http = require('http')
var merkleize = require('commonform-merkleize')
var server = require('./server')
var tape = require('tape')
var ws = require('ws')

tape('WebSocket streams form digests', function(test) {
  server(function(port, done) {
    var firstForm = { content: [ 'First form' ] }
    // var firstDigest = merkleize(firstForm).digest
    var secondForm = { content: [ 'Second form' ] }
    var secondDigest = merkleize(secondForm).digest
    // POST the first form before GET /feed.
    postForm(test, port, firstForm, function() {
      // Connect to the WebSocket.
      var socket = new ws(( 'ws://127.0.0.1:' + port ))
      var messages = [ ]
      socket
        .on('message', function(message) {
          messages.push(message) })
        .on('open', function() {
          // POST the second form after opening the socket.
          postForm(test, port, secondForm, function() {
            // Wait for /feed to stream a message about the second form.
            setTimeout(
              function() {
                socket.close()
                test.same(
                  messages,
                  [ secondDigest ],
                  'WebSocket sends digest for change after open')
                done()
                test.end() },
              100) }) }) }) }) })

function postForm(test, port, form, callback) {
  var request = {
    method: 'POST',
    path: '/forms',
    port: port }
  http.request(request, function(response) {
    test.equal(
      response.statusCode, 201,
      'POST /forms responds 201')
    callback() })
  .end(JSON.stringify(form)) }
