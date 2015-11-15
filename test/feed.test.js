var http = require('http')
var merkleize = require('commonform-merkleize')
var server = require('./server')
var tape = require('tape')

tape('GET /feed streams changes', function(test) {
  server(function(port, done) {
    var firstForm = { content: [ 'First form' ] }
    var firstDigest = merkleize(firstForm).digest
    var secondForm = { content: [ 'Second form' ] }
    var secondDigest = merkleize(secondForm).digest
    // POST the first form before GET /feed.
    postForm(test, port, firstForm, function() {
      // GET /feed.
      var get = { method: 'GET', path: '/feed', port: port }
      var request = http.get(get, function(response) {
        var buffers = [ ]
        response.on('data', function(buffer) {
          buffers.push(buffer) })
        // POST the second form after GET /feed.
        postForm(test, port, secondForm, function() {
          // Wait for /feed to stream a message about the second form.
          setImmediate(function() {
            // Abort GET /feed.
            request.abort()
            // Parse newline-delimeted JSON from /feed.
            var messages = (
              Buffer
                .concat(buffers)
                .toString()
                .split('\n')
                .slice(0, -1)
                .map(JSON.parse) )
            // GET /feed should have served "put messages" about both the
            // first form, which was posted before GET /feed, and the
            // second form, which was posted after GET /feed.
            test.same(
              messages,
              [ { type: 'put',
                  key: firstDigest,
                  value: firstForm },
                { type: 'put',
                  key: secondDigest,
                  value: secondForm } ],
              'GET /feed serves feed of events')
            done()
            test.end() }) }) }) }) }) })

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
