var badMethodRoute = require('./bad-method')
var meta = require('../package.json')

module.exports = indexRoute

function indexRoute(request, response) {
  if (request.method === 'GET') {
    response.end(JSON.stringify({
      service: meta.name,
      version: meta.version })) }
  else {
    badMethodRoute(request, response) } }
