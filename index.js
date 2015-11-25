var exists = require('level-exists')
var get = require('./routes/get')
var isSHA256 = require('is-sha-256-hex-digest')
var list = require('./routes/list')
var methodNotAllowed = require('./routes/method-not-allowed')
var notFound = require('./routes/not-found')
var post = require('./routes/post')
var root = require('./routes/root')
var url = require('url')
var HTTPCallback = require('httpcallback')

module.exports = function(bole, level) {
  exists.install(level)
  var callback = new HTTPCallback()
  return function(request, response) {
    var method = request.method
    var parsed = url.parse(request.url)
    var pathname = parsed.pathname
    if (pathname.startsWith('/forms/') && isSHA256(pathname.slice(7))) {
      if (method === 'GET') {
        get(bole, level, request, response) }
      else {
        methodNotAllowed(response) } }
    else if (pathname === '/') {
      if (method === 'GET') {
        root(bole, level, request, response) }
      else {
        methodNotAllowed(response) } }
    else if (pathname === '/forms') {
      if (method === 'POST') {
        post(bole, level, callback, request, response) }
      else if (method === 'GET') {
        list(bole, level, request, response) }
      else {
        methodNotAllowed(response) } }
    else if (pathname === '/callbacks') {
      if (method === 'POST') {
        callback.handler(request, response) }
      else {
        methodNotAllowed(response) } }
    else {
      notFound(response) } } }
