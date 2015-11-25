module.exports = internalError

/* istanbul ignore next */
function internalError(response) {
  response.statusCode = 500
  response.end() }
