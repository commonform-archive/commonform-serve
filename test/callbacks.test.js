var concat = require('concat-stream')
var http = require('http')
var merkleize = require('commonform-merkleize')
var series = require('async-series')
var server = require('./server')
var tape = require('tape')
var url = require('url')

tape('POST /callbacks with URL', function(test) {
  server(function(port, done) {
    http
      .request({ method: 'POST', path: '/callbacks', port: port })
      .once('response', function(response) {
        test.equal(response.statusCode, 202, 'responds 202')
        done()
        test.end() })
      .end('https://somewhere.else/endpoint') }) })

tape('POST /callbacks with bad URL', function(test) {
  server(function(port, done) {
    http
      .request({ method: 'POST', path: '/callbacks', port: port })
      .once('response', function(response) {
        test.equal(response.statusCode, 400, 'responds 400')
        done()
        test.end() })
      .end('blah blah blah') }) })

tape('GET /callbacks', function(test) {
  server(function(port, done) {
    var request = { method: 'GET', path: '/callbacks', port: port }
    http.request(request, function(response) {
      test.equal(response.statusCode, 405, 'responds 405')
      done()
      test.end() })
    .end() }) })

tape('callback on POST /forms', function(test) {
  test.plan(3)
  var form = { content: [ 'Some text' ] }
  var digest = merkleize(form).digest
  var endpoint = '/x'
  var calledback = http
    .createServer()
    .on('request', function(request, response) {
      var parsed = url.parse(request.url)
      var path = parsed.pathname
      var callback = ( request.method === 'POST' && path === endpoint )
      if (callback) {
        request.pipe(concat(function(buffer) {
          test.equal(
            buffer.toString(), digest,
            'called back with digest')
          response.end()
          calledback.close() } )) }
      else {
        throw new Error() } })
    .listen(0, function() {
      var calledbackPort = this.address().port
      var callbackURL = ( 'http://localhost:' + calledbackPort + endpoint )
      server(function(port, done) {
        series(
          [ function(done) {
              http
                .request({ method: 'POST', path: '/callbacks', port: port })
                .once('response', function(response) {
                  test.equal(response.statusCode, 202, 'registered')
                  done() })
                .once('error', done)
                .end(callbackURL) },
            function(done) {
              http
                .request({ method: 'POST', path: '/forms', port: port })
                .once('response', function(response) {
                  test.equal(response.statusCode, 201, 'posted form')
                  done() })
                .once('error', done)
                .end(JSON.stringify(form)) },
            function () {
              done() } ],
          function(error) {
            test.ifError(error)
            done() }) }) }) })

tape('no callback on POST /forms with existing form', function(test) {
  var form = { content: [ 'Some text' ] }
  var calledback = http
    .createServer()
    .on('request', function(request, response) {
      test.equal(true, false, 'no callback request received')
      response.end()
      calledback.close() })
    .listen(0, function() {
      var calledbackPort = this.address().port
      var callbackURL = ( 'http://localhost:' + calledbackPort + '/x' )
      server(function(port, done) {
        series(
          [ function(done) {
              http
                .request({ method: 'POST', path: '/forms', port: port })
                .once('response', function(response) {
                  test.equal(response.statusCode, 201, 'posted form')
                  done() })
                .once('error', done)
                .end(JSON.stringify(form)) },
            function(done) {
              http
                .request({ method: 'POST', path: '/callbacks', port: port })
                .once('response', function(response) {
                  test.equal(response.statusCode, 202, 'registered')
                  done() })
                .once('error', done)
                .end(callbackURL) },
            function(done) {
              http
                .request({ method: 'POST', path: '/forms', port: port })
                .once('response', function(response) {
                  test.equal(response.statusCode, 200, 'posted form')
                  done() })
                .once('error', done)
                .end(JSON.stringify(form)) },
            function () {
              setTimeout(
                function() {
                  calledback.close()
                  done()
                  test.end() },
                100) } ],
          function(error) {
            test.ifError(error)
            calledback.close()
            done() }) }) }) })
