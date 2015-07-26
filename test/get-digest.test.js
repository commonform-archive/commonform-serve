var concat = require('concat-stream')
var http = require('http')
var launchTestServer = require('./server')
var path = require('path')
var test = require('tape').test

test('GET /digests', function(test) {
  launchTestServer(function(port, callback) {
    var form = { content:['valid form']}
    var postRequest = { method: 'POST', path: '/forms', port: port }
    http.request(postRequest, function(postResponse) {
      test.equal(postResponse.statusCode, 201)
      var digest = path.basename(postResponse.headers.location)
      var getRequest = { method: 'GET', path: '/digests', port: port }
      http.request(getRequest, function(response) {
        response.pipe(concat(function(buffer) {
          test.equal(response.statusCode, 200)
          test.same(JSON.parse(buffer), [ digest ])
          callback()
          test.end() })) })
      .end() })
    .end(JSON.stringify(form)) }) })

test('GET /digests?prefix=:prefix', function(test) {
  launchTestServer(function(port, callback) {
    // Post a form.
    var form = { content:['valid form']}
    var postRequest = { method: 'POST', path: '/forms', port: port }
    http.request(postRequest, function(postResponse) {
      test.equal(postResponse.statusCode, 201)
      // Store its digest.
      var digest = path.basename(postResponse.headers.location)
      // Search for digests with a different prefix.
      var missPath = (
        '/digests?prefix=' + (digest[0] === 'a' ? 'b' : 'a'))
      var missRequest = { method: 'GET', path: missPath, port: port }
      http.request(missRequest, function(response) {
        response.pipe(concat(function(buffer) {
          // Confirm the new form's digest wasn't among the results.
          test.equal(response.statusCode, 200)
          test.ok(JSON.parse(buffer).indexOf(digest) < 0)
          // Search for digests starting with the same prefix as the
          // newly created form's.
          var hitPath = '/digests?prefix=' + digest[0]
          var hitRequest = { method: 'GET', path: hitPath, port: port }
          http.request(hitRequest, function(response) {
            // Confirm the new form's digest is among the results.
            test.equal(response.statusCode, 200)
            response.pipe(concat(function(buffer) {
              test.ok(JSON.parse(buffer).indexOf(digest) > -1)
              callback()
              test.end()
            })) })
          .end() })) })
      .end() })
    .end(JSON.stringify(form)) }) })

test('POST /digests', function(test) {
  launchTestServer(function(port, callback) {
    var postRequest = { method: 'POST', path: '/digests', port: port }
    http.request(postRequest, function(postResponse) {
      test.equal(postResponse.statusCode, 405)
      callback()
      test.end() })
    .end() }) })
