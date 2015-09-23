require('tape').test('POST /forms/:digest', function(test) {
  require('./server')(function(port, callback) {
    var path = ( '/forms/' + ( 'a'.repeat(64) ) )
    var request = { method: 'POST', path: path, port: port }
    require('http').request(request, function(response) {
      test.equal(response.statusCode, 405)
      callback()
      test.end() })
      .end() }) })
