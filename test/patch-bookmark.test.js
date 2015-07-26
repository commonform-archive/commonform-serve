require('tape').test('PATCH /bookmarks', function(test) {
  require('./server')(function(port, callback) {
    var request = { method: 'PATCH', path: '/bookmarks/t', port: port }
    require('http').request(request, function(bookmarkResponse) {
      test.equal(bookmarkResponse.statusCode, 405)
      callback()
      test.end() })
    .end() }) })
