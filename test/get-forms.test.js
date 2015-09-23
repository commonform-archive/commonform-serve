var concat = require('concat-stream')
var http = require('http')
var launchTestServer = require('./server')
var test = require('tape').test

test('GET /forms', function(test) {
  var a = { content: [ 'Form A' ] }
  var b = { content: [ 'Form B' ] }
  launchTestServer(function(port, callback) {
    var postA = { method: 'POST', path: '/forms', port: port }
    http.request(postA, function(response) {
      var digestA = response.headers.location
      var postB = { method: 'POST', path: '/forms', port: port }
      http.request(postB, function(response) {
        var digestB = response.headers.location
        test.equal(response.statusCode, 201)
        var get = { method: 'GET', path: '/forms', port: port }
        require('http').request(get, function(response) {
          test.equal(response.statusCode, 200)
          var listOfLocations = [ digestA, digestB ]
            .map(function(location) { return location.slice(7) })
            .sort()
            .join('\n')
          response
            .pipe(concat(function(buffer) {
              test.equal(buffer.toString(), listOfLocations + '\n')
              callback()
              test.end() })) })
          .end() })
        .end(JSON.stringify(b)) })
      .end(JSON.stringify(a)) }) })

test('PATCH /forms', function(test) {
  launchTestServer(function(port, callback) {
    var request = { method: 'PATCH', path: '/forms', port: port }
    http.request(request, function(response) {
      test.equal(response.statusCode, 405)
      callback()
      test.end() })
      .end() }) })
