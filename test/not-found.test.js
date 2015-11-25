var http = require('http')
var server = require('./server')
var tape = require('tape')

tape('GET /nonexistent', function(test) {
  server(function(port, done) {
    var request = {
      path: '/nonexistent',
      port: port }
    http.get(request, function(response) {
      test.equal(
        response.statusCode, 404,
        'responds 404')
      done()
      test.end() }) }) })
