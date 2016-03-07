/* Copyright 2015 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var HTTPCallback = require('httpcallback')
var exists = require('level-exists')
var isSHA256 = require('is-sha-256-hex-digest')
var url = require('url')
var uuid = require('uuid')

var get = require('./routes/get')
var list = require('./routes/list')
var methodNotAllowed = require('./routes/method-not-allowed')
var notFound = require('./routes/not-found')
var post = require('./routes/post')
var root = require('./routes/root')

module.exports = function(bole, level) {
  // Install the `.exists(function(error, exists){ ... })` LevelUp extension to
  // the provided data store object. This is used in the form post route.
  exists.install(level)

  // Set up callback-related logging.
  // Create a callback-specific sub-log.
  var callbackLog = bole('callbacks')
  // The callback object itself is an EventEmitter, so we subscribe to its
  // events in order to log them.
  /* istanbul ignore next */
  var callback = new HTTPCallback()
    // Events related to registration of callbacks.
    .on('registration', function(href) {
      callbackLog.info({ event: 'register', href: href }) })
    .on('deregistration', function(url) {
      callbackLog.info({ event: 'deregister', href: url.href }) })
    .on('badrequest', function(url) {
      // A request tried to register an HTTP callback, but something was wrong.
      callbackLog.warn({ event: 'badregister', href: url.href }) })
    // Events related to attempts to make callback requests.
    .on('attempt', function(href, count) {
      callbackLog.warn({ event: 'attempt', count: count }) })
    .on('success', function(href) {
      callbackLog.warn({ event: 'success', href: href }) })
    .on('failure', function(error) {
      callbackLog.warn(error, { event: 'failure', href: url.href }) })

  // Return the HTTP (or HTTPS) request handler function.
  return function(request, response) {

    // Set up request logging.
    // Create a request-specific sub-log, using a standard unique identifier
    // for each request.
    request.log = bole(uuid.v4())
    // Log the request.
    request.log.info(request)
    // Log the response status code automatically.
    request.once('end', function() {
      request.log.info({ event: 'end', status: response.statusCode }) })

    // Route the request.
    var method = request.method
    var parsed = url.parse(request.url)
    var pathname = parsed.pathname
    // Try the most common routes first.
    if (pathname.startsWith('/forms/') && isSHA256(pathname.slice(7))) {
      if (method === 'GET') {
        // Serve a copy of a form.
        get(bole, level, request, response) }
      else {
        methodNotAllowed(response) } }
    else if (pathname === '/') {
      if (method === 'GET') {
        // Serve metadata about this service.
        root(bole, level, request, response) }
      else {
        methodNotAllowed(response) } }
    else if (pathname === '/forms') {
      if (method === 'POST') {
        // In addition to the bole logger and LevelUp data store, the form post
        // route also takes the HTTP callback object, so that it can dispatch
        // HTTP callbacks if a new form is written to the data store.
        post(bole, level, callback, request, response) }
      else if (method === 'GET') {
        // List stored forms' digests.
        list(bole, level, request, response) }
      else {
        methodNotAllowed(response) } }
    else if (pathname === '/callbacks') {
      if (method === 'POST') {
        // Register an HTTP callback for notice of new forms.
        callback.handler(request, response) }
      else {
        methodNotAllowed(response) } }
    else {
      notFound(response) } } }
