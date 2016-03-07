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

module.exports = post

var concat = require('concat-stream')
var internalError = require('./internal-error')
var isChild = require('commonform-predicate').child
var merkleize = require('commonform-merkleize')
var stringify = require('commonform-serialize').stringify
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

// Given a new LevelUp chain-style batch, a denormalized Common Form, and the
// output of commonform-merkleize for that Common Form, add LevelUp put
// operations to the batch for the Common Form and each of its children.
function batchForms(batch, form, merkle) {
  // Use commonform-stringify to produce the text to be stored.
  var stringified = stringify(form)
  var digest = merkle.digest
  batch.put(digest, stringified)
  // Recurse children.
  form.content
    .forEach(function(element, index) {
      if (isChild(element)) {
        var childForm = element.form
        var childMerkle = merkle.content[index]
        batchForms(batch, childForm, childMerkle) } }) }

// JSON.parse, wrapped to take an errback.
function parseJSON(input, callback) {
  var error
  var result
  try {
    result = JSON.parse(input) }
  catch (e) {
    error = e }
  callback(error, result) }
