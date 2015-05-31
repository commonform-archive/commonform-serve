var launchTestServer = require('./server');
var swagger = require('swagger-client');
var test = require('tape');

function serverAndSwagger(description, callback) {
  test('Swagger operation ' + description, function(test) {
    launchTestServer(function(port, closeServer) {
      var client = new swagger({
        url: 'http://localhost:' + port + '/swagger.json',
        success: function() {
          callback(test, client.default, function() {
            closeServer();
            test.end();
          });
        }
      });
    });
  });
}

module.exports = serverAndSwagger;
