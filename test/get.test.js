var concat = require('concat-stream')
var http = require('http')
var server = require('./server')
var tape = require('tape')
var isSHA256 = require('is-sha-256-hex-digest')

tape('POST and GET a form', function(test) {
  var posted = { content: [ 'Some text' ] }
  server(function(port, done) {
    var post = {
      method: 'POST',
      path: '/',
      port: port }
    http.request(post, function(response) {
      test.equal(
        response.statusCode, 201,
        'responds 201')
      test.assert(
        isSHA256(response.headers.location.slice(1)),
        'sets Location header')
      var get = {
        path: response.headers.location,
        port: port }
      http.get(get, function(response) {
        response.pipe(concat(function(buffer) {
          var served = JSON.parse(buffer)
          test.same(
            served,
            posted,
            'serves the same form back')
          done()
          test.end() })) }) })
    .end(JSON.stringify(posted)) }) })
