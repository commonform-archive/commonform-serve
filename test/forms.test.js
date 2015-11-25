var concat = require('concat-stream')
var http = require('http')
var isSHA256 = require('is-sha-256-hex-digest')
var merkleize = require('commonform-merkleize')
var series = require('async-series')
var server = require('./server')
var tape = require('tape')

tape('POST /forms with valid form', function(test) {
  var form = { content: [ 'Some text' ] }
  var digest = merkleize(form).digest
  server(function(port, done) {
    var request = { method: 'POST', path: '/forms', port: port }
    http.request(request, function(response) {
      test.equal(response.statusCode, 201, 'responds 201')
      test.assert(
        response.headers.hasOwnProperty('location'),
        'sets Location header')
      test.assert(
        response.headers.location.indexOf(digest),
        'location includes digest')
      done()
      test.end() })
    .end(JSON.stringify(form)) }) })

tape('POST /forms with invalid form', function(test) {
  var form = { blah: 'blah' }
  server(function(port, done) {
    var request = { method: 'POST', path: '/forms', port: port }
    http.request(request, function(response) {
      test.equal(response.statusCode, 400, 'responds 400')
      done()
      test.end() })
    .end(JSON.stringify(form)) }) })

tape('POST /forms with valid form', function(test) {
  var form = { content: [ 'Some text' ] }
  var digest = merkleize(form).digest
  server(function(port, done) {
    var request = { method: 'POST', path: '/forms', port: port }
    series(
      [ function(done) {
          http.request(request)
            .once('response', function(response) {
              test.equal(response.statusCode, 201, 'responds 201')
              test.assert(
                response.headers.hasOwnProperty('location'),
                'sets Location header')
              test.assert(
                response.headers.location.indexOf(digest),
                'location includes digest')
              done() })
            .once('error', done)
            .end(JSON.stringify(form)) },
        function(done) {
          http.request(request)
            .once('response', function(response) {
              test.equal(response.statusCode, 200, 'responds 200')
              test.assert(
                response.headers.hasOwnProperty('location'),
                'sets Location header again')
              test.assert(
                response.headers.location.indexOf(digest),
                'location includes digest again')
              done() })
            .once('error', done)
            .end(JSON.stringify(form)) },
        function() {
          done()
          test.end() } ],
      function(error) {
        test.ifError(error)
        done()
        test.end() }) }) })

tape('POST /forms with non-JSON', function(test) {
  server(function(port, done) {
    var request = { method: 'POST', path: '/forms', port: port }
    http.request(request, function(response) {
      test.equal(response.statusCode, 400, 'responds 400')
      done()
      test.end() })
    .end('just plain text') }) })

tape('PUT /forms', function(test) {
  server(function(port, done) {
    var request = { method: 'PUT', path: '/forms', port: port }
    http.request(request, function(response) {
      test.equal(response.statusCode, 405, 'responds 405')
      done()
      test.end() })
    .end() }) })

tape('PUT /forms/<digest>', function(test) {
  var digest = 'a'.repeat(64)
  var path = ( '/forms/' + digest )
  server(function(port, done) {
    var request = { method: 'PUT', path: path, port: port }
    http.request(request, function(response) {
      test.equal(response.statusCode, 405, 'responds 405')
      done()
      test.end() })
    .end() }) })

tape('POST and GET a form', function(test) {
  var posted = { content: [ 'Some text' ] }
  server(function(port, done) {
    var post = { method: 'POST', path: '/forms', port: port }
    http.request(post, function(response) {
      test.equal(response.statusCode, 201, 'responds 201')
      test.assert(
        isSHA256(response.headers.location.slice(7)),
        'sets Location header')
      var get = {
        path: response.headers.location,
        port: port }
      http.get(get, function(response) {
        response.pipe(concat(function(buffer) {
          var served = JSON.parse(buffer)
          test.same(served, posted, 'serves the same form back')
          done()
          test.end() })) }) })
    .end(JSON.stringify(posted)) }) })

tape('POST and GET a deep form', function(test) {
  var form = {
    content: [
      'Some text',
      { heading: 'Some Heading',
        form: { content: [ 'Even more text' ] } } ] }
  var digest = merkleize(form).digest
  server(function(port, done) {
    var post = { method: 'POST', path: '/forms', port: port }
    http.request(post, function(response) {
      test.equal(response.statusCode, 201, 'responds 201')
      test.assert(
        isSHA256(response.headers.location.slice(7)),
        'sets Location header')
      var get = {
        path: ( '/forms/' + digest ),
        port: port }
      http.get(get, function(response) {
        response.pipe(concat(function(buffer) {
          var served = JSON.parse(buffer)
          test.same(served, form, 'serves the same form back')
          done()
          test.end() })) }) })
    .end(JSON.stringify(form)) }) })

tape('POST and GET a child form', function(test) {
  var posted = {
    content: [
      'Some text',
      { heading: 'Some Heading',
        form: { content: [ 'More text!' ] } } ] }
  var child = posted.content[1].form
  var childDigest = merkleize(child).digest
  server(function(port, done) {
    var post = { method: 'POST', path: '/forms', port: port }
    http.request(post, function(response) {
      test.equal(response.statusCode, 201, 'responds 201')
      test.assert(
        isSHA256(response.headers.location.slice(7)),
        'sets Location header')
      var get = {
        path: ( '/forms/' + childDigest ),
        port: port }
      http.get(get, function(response) {
        response.pipe(concat(function(buffer) {
          var served = JSON.parse(buffer)
          test.same(served, child, 'serves the child form back')
          done()
          test.end() })) }) })
    .end(JSON.stringify(posted)) }) })

tape('GET a nonexistent form', function(test) {
  var digest = 'a'.repeat(64)
  server(function(port, done) {
    var get = {
      path: ( '/forms/' + digest ),
      port: port }
    http.get(get, function(response) {
      test.equal(response.statusCode, 404, 'responds 404')
      done()
      test.end() }) }) })

tape('GET /forms', function(test) {
  var posted = {
    content: [
      'Some text',
      { heading: 'Some Heading',
        form: { content: [ 'More text!' ] } } ] }
  var parentDigest = merkleize(posted).digest
  var childDigest = merkleize(posted.content[1].form).digest
  server(function(port, done) {
    var post = { method: 'POST', path: '/forms', port: port }
    http.request(post, function(response) {
      test.equal(response.statusCode, 201, 'responds 201')
      var get = { path: '/forms', port: port }
      http.get(get, function(response) {
        response.pipe(concat(function(buffer) {
          test.same(
            buffer.toString(),
            ( [ parentDigest, childDigest ]
              .sort()
              .join('\n') + '\n' ),
            'serves list of digests')
          done()
          test.end() })) }) })
    .end(JSON.stringify(posted)) }) })
