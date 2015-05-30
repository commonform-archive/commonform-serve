var badMethodRoute = require('./bad-method');
var version = require('../../package').version;

function definitionsRoute(
  request, response, parameters, splats, level
) {
  if (request.method === 'GET') {
    var term = parameters.term;
    var pattern = {predicate: 'defines', object: term};
    response.write('{');
    response.write('"version":' + JSON.stringify(version) + ',');
    response.write('"term":' + JSON.stringify(term) + ',');
    response.write('"definitions":[');
    level.createFormsReadStream(pattern)
      .on('data', function(result) {
        response.write(JSON.stringify(result));
      })
      .on('end', function() {
        response.end(']}');
      });
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = definitionsRoute;
