var http = require('http')
var launchTestServer = require('./server')
var test = require('tape').test
var path = require('path')

test('POST /bookmarks with valid digest and bookmark', function(test) {
  launchTestServer(function(port, callback) {
    var form = { content:['Some content']}
    var bookmark = 'super'
    var bookmarkPath = '/bookmarks/' + bookmark
    var formRequest = { method: 'POST', path: '/forms', port: port }
    http.request(formRequest, function(formResponse) {
      test.equal(formResponse.statusCode, 201)
      var digest = path.basename(formResponse.headers.location)
      var bookmarkRequest = {
        method: 'POST',
        path: bookmarkPath,
        port: port }
      http.request(bookmarkRequest, function(bookmarkResponse) {
        test.equal(bookmarkResponse.statusCode, 201)
        test.equal(bookmarkResponse.headers.location, bookmarkPath)
        callback()
        test.end() })
      .end(digest) })
    .end(JSON.stringify(form)) }) })

test('POST /bookmarks with an invalid digest', function(test) {
  launchTestServer(function(port, callback) {
    var bookmark = 'avalidbookmark'
    var bookmarkRequest = {
      method: 'POST',
      path: '/bookmarks/' + bookmark,
      port: port }
    http.request(bookmarkRequest, function(bookmarkResponse) {
      test.equal(bookmarkResponse.statusCode, 400)
      callback()
      test.end() })
    .end('') }) })

test('POST /bookmarks with an invalid bookmark', function(test) {
  launchTestServer(function(port, callback) {
    var form = { content:['more content']}
    var bookmark = '§'
    var formRequest = { method: 'POST', path: '/forms', port: port }
    http.request(formRequest, function(formResponse) {
      test.equal(formResponse.statusCode, 201)
      var digest = path.basename(formResponse.headers.location)
      var bookmarkRequest = {
        method: 'POST',
        path: '/bookmarks/' + encodeURIComponent(bookmark),
        port: port }
      http.request(bookmarkRequest, function(bookmarkResponse) {
        test.equal(bookmarkResponse.statusCode, 400)
        callback()
        test.end() })
      .end(digest) })
    .end(JSON.stringify(form)) }) })
