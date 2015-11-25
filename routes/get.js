var internalError = require('./internal-error')
var notFound = require('./not-found')
var url = require('url')

module.exports = function get(bole, level, request, response) {
  var digest = url.parse(request.url).pathname.slice(7)
  level.get(digest, function(error, data) {
    if (error) {
      /* istanbul ignore else */
      if (error.notFound) {
        notFound(response) }
      else {
        bole.error(error)
        internalError(response) } }
    else {
      response.setHeader('Content-Type', 'application/json')
      response.end(data) } }) }
