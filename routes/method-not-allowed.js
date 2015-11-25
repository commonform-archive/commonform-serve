module.exports = methodNotAllowed

function methodNotAllowed(response) {
  response.statusCode = 405
  response.end() }
