var concat = require('concat-stream')
var http = require('http')
var meta = require('../package.json')
var server = require('./server')
var tape = require('tape')
var isSHA256 = require('is-sha-256-hex-digest')

tape('GET /', function(test) {
  server(function(port, done) {
    var request = {
      path: '/',
      port: port }
    http.get(request, function(response) {
      test.equal(
        response.statusCode, 200,
        'responds 200')
      response.pipe(concat(function (buffer) {
        test.same(
          JSON.parse(buffer),
          { service: meta.name,
            version: meta.version },
          'serves JSON with service name and version')
        done()
        test.end() })) }) }) })

tape('POST / with valid form', function(test) {
  var form = { content: [ 'Some text' ] }
  server(function(port, done) {
    var request = {
      method: 'POST',
      path: '/',
      port: port }
    http.request(request, function(response) {
      test.equal(
        response.statusCode, 201,
        'responds 201')
      test.assert(
        isSHA256(response.headers.location.slice(1)),
        'sets Location header')
      done()
      test.end() })
    .end(JSON.stringify(form)) }) })

tape('POST / with invalid form', function(test) {
  var form = { blah: 'blah' }
  server(function(port, done) {
    var request = {
      method: 'POST',
      path: '/',
      port: port }
    http.request(request, function(response) {
      test.equal(
        response.statusCode, 400,
        'responds 400')
      done()
      test.end() })
    .end(JSON.stringify(form)) }) })

tape('POST / with non-JSON', function(test) {
  server(function(port, done) {
    var request = {
      method: 'POST',
      path: '/',
      port: port }
    http.request(request, function(response) {
      test.equal(
        response.statusCode, 400,
        'responds 400')
      done()
      test.end() })
    .end('just plain text') }) })
