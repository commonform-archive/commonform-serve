module.exports = notFoundRoute

function notFoundRoute(request, response) {
  response.statusCode = 404
  response.end() }
