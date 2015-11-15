var meta = require('./package.json')

module.exports = function(bole, level) {
  return function(request, response) {
    if (request.method === 'GET') {
      response.setHeader('Content-Type', 'application/json')
      response.end(
        JSON.stringify({
          service: meta.name,
          version: meta.version })) }
    else {
      response.statusCode = 405
      response.end() } } }
