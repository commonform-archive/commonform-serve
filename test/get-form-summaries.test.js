var concat = require('concat-stream')
var http = require('http')
var launchTestServer = require('./server')
var path = require('path')
var test = require('tape').test
var version = require('../package').version

test('GET /forms/:digest/summaries', function(test) {
  launchTestServer(function(port, callback) {
    var child =  { content:['child form']}
    var parent = { content: [{ heading: 'Heading', form: child }]}
    var postForm = { method: 'POST', path: '/forms', port: port }
    http.request(postForm, function(response) {
      var childDigest = path.basename(response.headers.location)
      http.request(postForm, function(response) {
        var parentDigest = path.basename(response.headers.location)
        var searchPath = '/forms/' + childDigest + '/summaries'
        var getRequest = { method: 'GET', path: searchPath, port: port }
        http.request(getRequest, function(response) {
          response.pipe(concat(function(buffer) {
            test.same(
              JSON.parse(buffer),
              { form: childDigest,
                summaries: [{ digest: parentDigest, form: parent }],
                version: version })
            callback()
            test.end() })) })
        .end() })
      .end(JSON.stringify(parent)) })
    .end(JSON.stringify(child)) }) })

test('POST /forms/:digest/summaries', function(test) {
  launchTestServer(function(port, callback) {
    var searchPath = '/forms/x/summaries'
    var getRequest = { method: 'POST', path: searchPath, port: port }
    http.request(getRequest, function(getResponse) {
      test.equal(getResponse.statusCode, 405)
      callback()
      test.end() })
    .end() }) })
