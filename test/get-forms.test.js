require('tape').test('GET /forms', function(test) {
  require('./server')(function(port, callback) {
    var request = { method: 'GET', path: '/forms', port: port }
    require('http').request(request, function(response) {
      test.equal(response.statusCode, 405)
      callback()
      test.end() })
      .end() }) })
