module.exports = post

var batchForms = require('../batch-forms')
var concat = require('concat-stream')
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
          var location = ( '/forms/' + merkle.digest )
          var batch = level.batch()
          batch.digests = [ ]
          batchForms(batch, form, merkle)
          batch.write(function(error) {
            if (error) {
              response.statusCode = 500
              response.end() }
            else {
              response.statusCode = 201
              response.setHeader('Location', location)
              response.end()
              callback.send(function(stream) {
                stream.end(merkle.digest) }) } }) } } }) })) }
