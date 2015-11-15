var meta = require('../package.json')

module.exports = function root(bole, level, request, response) {
  response.setHeader('Content-Type', 'application/json')
  response.end(
    JSON.stringify({
      service: meta.name,
      version: meta.version })) }
