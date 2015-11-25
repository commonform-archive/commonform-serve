module.exports = post

var batchForms = require('../batch-forms')
var concat = require('concat-stream')
var internalError = require('./internal-error')
var merkleize = require('commonform-merkleize')
var parseJSON = require('../parse-json')
var validate = require('commonform-validate')

function post(bole, level, callback, request, response) {
  request.pipe(concat(function(buffer) {
    parseJSON(buffer, function(error, form) {
      // Invalid JSON
      if (error) {
        response.statusCode = 400
        response.end() }
      // Valid JSON
      else {
        var valid = validate.form(form)
        // Invalid Common Form
        if (!valid) {
          response.statusCode = 400
          response.end() }
        // Valid Common Form
        else {
          var merkle = merkleize(form)
          var digest = merkle.digest
          level.exists(digest, function(error, exists) {
            /* istanbul ignore if */
            if (error) {
              internalError(response) }
            else {
              var location = ( '/forms/' + merkle.digest )
              // If the form already exists, just respond 201, and don't POST
              // to callbacks.
              if (exists) {
                response.statusCode = 200
                response.setHeader('Location', location)
                response.end() }
              // If the form is a new one, write to LevelUp and POST the root
              // digest to callbacks.
              else {
                var batch = level.batch()
                batchForms(batch, form, merkle)
                batch.write(function(error) {
                  /* istanbul ignore if */
                  if (error) {
                    internalError(response) }
                  else {
                    response.statusCode = 201
                    response.setHeader('Location', location)
                    response.end()
                    callback.send(function(stream) {
                      stream.end(digest) }) } }) } } }) } } }) })) }
