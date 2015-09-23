var badInputRoute = require('./bad-input')
var badMethodRoute = require('./bad-method')
var concat = require('concat-stream')
var internalErrorRoute = require('./internal-error')
var parseJSON = require('../parse-json')

module.exports = formsRoute

function formsRoute(request, response, level) {
  if (request.method === 'POST') {
    request.pipe(concat(function(buffer) {
      parseJSON(buffer, function(error, form) {
        if (error) {
          badInputRoute(request, response) }
        else {
          level.put(form, function(error, digest) {
            if (error) {
              if (error.message === 'Invalid form') {
                badInputRoute(request, response) }
              else {
                internalErrorRoute(error, request, response) } }
            else {
              response.statusCode = 201
              response.setHeader('location', ( '/forms/' + digest ))
              response.end() } }) } }) })) }
  else if (request.method === 'GET') {
    level.createKeyStream()
      .on('data', function(key) {
        response.write(key + '\n') })
      .on('end', function() {
        response.end() }) }
  else {
    badMethodRoute(request, response) } }
