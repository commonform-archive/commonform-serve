var badMethodRoute = require('./bad-method');
var concat = require('concat-stream');

function parseJSON(input, callback) {
  var json;
  try {
    json = JSON.parse(input);
  } catch (e) {
    return callback(e);
  }
  callback(null, json);
}

function badInput(request, response) {
  response.statusCode = 400;
  response.end();
}

function postFormsRoute(request, response, parameters, splats, level) {
  if (request.method === 'POST') {
    request.pipe(concat(function(buffer) {
      parseJSON(buffer, function(error, form) {
        if (error) {
          badInput(request, response);
        } else {
          level.putForm(form, function(error, digest) {
            if (error) {
              if (error.invalidForm) {
                badInput(request, response);
              } else {
                request.log.error(error);
                response.statusCode = 500;
                response.end();
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

module.exports = postFormsRoute;
