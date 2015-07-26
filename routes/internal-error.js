function internalErrorRoute(error, request, response) {
  request.log.error(error)
  response.statusCode = 500
  response.end() }

module.exports = internalErrorRoute
