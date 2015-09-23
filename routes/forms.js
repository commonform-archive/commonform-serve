var badInputRoute = require('./bad-input');
var badMethodRoute = require('./bad-method');
var concat = require('concat-stream');
var internalErrorRoute = require('./internal-error');
var parseJSON = require('../parse-json');

function formsRoute(request, response, level) {
  if (request.method === 'POST') {
    request.pipe(concat(function(buffer) {
      parseJSON(buffer, function(error, form) {
        if (error) {
          badInputRoute(request, response);
        } else {
          level.putForm(form, function(error, digest) {
            if (error) {
              if (error.invalidForm) {
                badInputRoute(request, response);
              } else {
                internalErrorRoute(error, request, response);
              }
            } else {
              response.statusCode = 201;
              response.setHeader('location', '/forms/' + digest);
              response.end();
            }
          });
        }
      });
    }));
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = formsRoute;
