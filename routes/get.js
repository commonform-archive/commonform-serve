var url = require('url')

module.exports = function get(bole, level, request, response) {
  var digest = url.parse(request.url).pathname.slice(7)
  level.get(digest, function(error, data) {
    if (error) {
      if (error.notFound) {
        response.statusCode = 404
        response.end() }
      else {
        response.statusCode = 500
        response.end() } }
    else {
      response.setHeader('Content-Type', 'application/json')
      response.end(data) } }) }
