module.exports = internalError

function internalError(response) {
  response.statusCode = 500
  response.end() }
