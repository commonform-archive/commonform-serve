var get = require('./routes/get')
var isSHA256 = require('is-sha-256-hex-digest')
var post = require('./routes/post')
var root = require('./routes/root')
var url = require('url')

module.exports = function(bole, level) {
  return function(request, response) {
    var method = request.method
    var parsed = url.parse(request.url)
    var pathname = parsed.pathname
    if (pathname === '/') {
      if (method === 'GET') {
        root(bole, level, request, response) }
      else {
        response.statusCode = 405
        response.end() } }
    else if (pathname === '/forms/' || pathname === '/forms') {
      if (method === 'POST') {
        post(bole, level, request, response) }
      else {
        response.statusCode = 405
        response.end() } }
    else if (pathname.startsWith('/forms/') && isSHA256(pathname.slice(7))) {
      if (method === 'GET') {
        get(bole, level, request, response) }
      else {
        response.statusCode = 405
        response.end() } }
    else {
      response.statusCode = 404
      response.end() } } }
