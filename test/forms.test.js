var concat = require('concat-stream')
var http = require('http')
var isSHA256 = require('is-sha-256-hex-digest')
var normalize = require('commonform-normalize')
var server = require('./server')
var tape = require('tape')

tape('POST / with valid form', function(test) {
  var form = { content: [ 'Some text' ] }
  var digest = normalize(form).digest
  server(function(port, done) {
    var request = {
      method: 'POST',
      path: '/forms',
      port: port }
    http.request(request, function(response) {
      test.equal(
        response.statusCode, 201,
        'responds 201')
      test.assert(
        response.headers.hasOwnProperty('location'),
        'sets Location header')
      test.assert(
        response.headers.location.indexOf(digest),
        'location includes digest')
      done()
      test.end() })
    .end(JSON.stringify(form)) }) })

tape('POST / with invalid form', function(test) {
  var form = { blah: 'blah' }
  server(function(port, done) {
    var request = {
      method: 'POST',
      path: '/forms',
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
      path: '/forms',
      port: port }
    http.request(request, function(response) {
      test.equal(
        response.statusCode, 400,
        'responds 400')
      done()
      test.end() })
    .end('just plain text') }) })

tape('POST and GET a form', function(test) {
  var posted = { content: [ 'Some text' ] }
  server(function(port, done) {
    var post = {
      method: 'POST',
      path: '/forms',
      port: port }
    http.request(post, function(response) {
      test.equal(
        response.statusCode, 201,
        'responds 201')
      test.assert(
        isSHA256(response.headers.location.slice(7)),
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
