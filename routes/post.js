var concat = require('concat-stream')
var normalize = require('commonform-normalize')
var parseJSON = require('../parse-json')
var validate = require('commonform-validate')

module.exports = function post(bole, level, request, response) {
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
          var normalized = normalize(form)
          var root = normalized.root
          delete normalized.root
          var location = ( '/forms/' + root )
          var batch = Object.keys(normalized)
            .map(function(digest) {
              return {
                type: 'put',
                key: digest,
                value: JSON.stringify(normalized[digest]) } })
          level.batch(batch, function(error) {
            if (error) {
              response.statusCode = 500
              response.end() }
            else {
              response.statusCode = 201
              response.setHeader('Location', location)
              response.end() } }) } } }) })) }
