var http = require('http')
var merkleize = require('commonform-merkleize')
var meta = require('../package.json')
var server = require('./server')
var tape = require('tape')

tape('GET /events', function(test) {
  var form = { content: [ 'Some text' ] }
  var digest = merkleize(form).digest
  server(function(port, done) {
    var get = { method: 'GET', path: '/events', port: port }
    var request = http.get(get, function(response) {
      var buffers = [ ]
      response
        .on('data', function(buffer) {
          buffers.push(buffer) })
      var post = { method: 'POST', path: '/forms', port: port }
      http.request(post, function(response) {
        test.equal(
          response.statusCode, 201,
          'responds 201')
        request.abort()
        var events = Buffer.concat(buffers).toString()
        test.equal(
          events,
          [ ( ':' + meta.name + ' version ' + meta.version + '\n' ),
            ( 'data:' + digest + '\n\n' ) ]
          .join(''),
          'events')
        done()
        test.end() })
      .end(JSON.stringify(form)) }) }) })

tape('GET /events gives heartbeat', function(test) {
  server(function(port, done) {
    var get = { method: 'GET', path: '/events', port: port }
    var request = http.get(get, function(response) {
      var buffers = [ ]
      response
        .on('data', function(buffer) {
          buffers.push(buffer) })
      setTimeout(
        function() {
          request.abort()
          var events = Buffer.concat(buffers).toString()
          test.equal(
            events,
            [ ( ':' + meta.name + ' version ' + meta.version + '\n' ),
              ':\n' ]
            .join(''),
            'events')
          done()
          test.end() },
        ( 16 * 1000 )) }) }) })
