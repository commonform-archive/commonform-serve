var badMethodRoute = require('./bad-method');
var concat = require('concat-stream');

function postFormsRoute(request, response, parameters, splats, level) {
  if (request.method === 'POST') {
    request.pipe(concat(function(buffer) {
      var form = JSON.parse(buffer);
      level.putForm(form, function(error, digest) {
        if (error) {
          request.log.info('400');
          response.statusCode = 400;
          response.end();
        } else {
          request.log.info('201');
          response.statusCode = 201;
          response.setHeader('location', '/forms/' + digest);
          response.end();
        }
      });
    }));
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = postFormsRoute;
