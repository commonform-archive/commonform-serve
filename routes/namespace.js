var badMethodRoute = require('./bad-method')

function generateNamespaceRoute(type) {
  var capitalized = type[0].toUpperCase() + type.slice(1)

  return function generatedNamespaceRoute(
      request, response, parameters, splats, level, query) {
    if (request.method === 'GET') {
      var prefix = query.prefix
      var first = true
      response.write('[')
      level['create' + capitalized + 'ReadStream'](prefix)
        .on('data', function(digest) {
          response.write((first ? '' : ',') + JSON.stringify(digest))
          first = false })
        .on('end', function() {
          response.end(']') }) }
    else {
      badMethodRoute(request, response) } } }

module.exports = generateNamespaceRoute
