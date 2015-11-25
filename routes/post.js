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
        bole.info({ issue: 'Invalid JSON', body: buffer.toString() })
        response.statusCode = 400
        response.end() }
      // Valid JSON
      else {
        var valid = validate.form(form)
        // Invalid Common Form
        if (!valid) {
          bole.info({ event: 'Invalid Common Form', body: form })
          response.statusCode = 400
          response.end() }
        // Valid Common Form
        else {
          bole.info({ event: 'Valid Form' })
          var merkle = merkleize(form)
          var digest = merkle.digest
          bole.info({
            digest: digest,
            children: ( Object.keys(merkle).length - 2 ) })
          level.exists(digest, function(error, exists) {
            /* istanbul ignore if */
            if (error) {
              bole.error(error)
              internalError(response) }
            else {
              var location = ( '/forms/' + digest )
              // If the form already exists, just respond 201, and don't POST
              // to callbacks.
              if (exists) {
                bole.info({ event: 'Common Form Already Exists' })
                response.statusCode = 200
                response.setHeader('Location', location)
                response.end() }
              // If the form is a new one, write to LevelUp and POST the root
              // digest to callbacks.
              else {
                bole.info({ event: 'New Form', form: form })
                var batch = level.batch()
                batchForms(batch, form, merkle)
                batch.write(function(error) {
                  /* istanbul ignore if */
                  if (error) {
                    bole.error(error)
                    internalError(response) }
                  else {
                    bole.info({ event: 'Stored' })
                    response.statusCode = 201
                    response.setHeader('Location', location)
                    response.end()
                    bole.info({ event: 'Sending Callbacks' })
                    callback.send(function(stream) {
                      stream.end(digest) }) } }) } } }) } } }) })) }
