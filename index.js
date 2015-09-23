var isSHA256 = require('is-sha-256-hex-digest')
var levelCommonform = require('level-commonform')
var notFoundRoute = require('./routes/not-found')
var url = require('url')
var uuid = require('uuid')

var forms = require('./routes/forms')
var formsByDigest = require('./routes/forms-by-digest')
var index = require('./routes/index')

module.exports = requestHandler

// Generate an HTTP request handler, given a bole logger and a
// LevelUp-compatible data store.
function requestHandler(bole, levelup) {

  // Wrap Common Form-specific data storage around the provided
  // LevelUp-compatible data store.
  var level = levelCommonform(levelup)

  return function(request, response) {
    // Create a logger for each request, using a UUID, and bind it to a
    // property of the request object.
    request.log = bole(uuid.v4())
    request.log.info(request)

    // Log that the end of the request and HTTP status.
    request
      .on('end', function() {
        request.log.info({ status: response.statusCode })
        request.log.info({ event: 'end' }) })

    // Route the request to the appropriate handler.
    var parsed = url.parse(request.url)
    var pathname = parsed.pathname
    if (pathname === '/') {
      index(request, response) }
    else if (pathname === '/forms/' || pathname === '/forms') {
      forms(request, response, level) }
    else if (pathname.startsWith('/forms/') && isSHA256(pathname.slice(7))) {
      formsByDigest(request, response, pathname.slice(7), level) }
    // The request did not map a request handler.
    else {
      notFoundRoute(request, response) } } }
