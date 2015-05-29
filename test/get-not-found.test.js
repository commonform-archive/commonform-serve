require('tape').test('GET /:nonexistent', function(test) {
  require('./server')(function(port, callback) {
    require('http').get({path: '/x', port: port}, function(response) {
      test.equal(response.statusCode, 404);
      callback();
      test.end();
    });
  });
});
