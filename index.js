var meta = require('./package.json')
var post = require('./post')

module.exports = function(bole, level) {
  return function(request, response) {
    var method = request.method
    if (method === 'GET') {
      var url = require('url').parse(request.url)
      if (url.pathname === '/') {
        response.setHeader('Content-Type', 'application/json')
        response.end(
          JSON.stringify({
            service: meta.name,
            version: meta.version })) }
      else {
        var digest = url.pathname.slice(1)
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
            response.end(data) } }) } }
    else if (method === 'POST') {
      post(bole, level, request, response) }
    else {
      response.statusCode = 405
      response.end() } } }
