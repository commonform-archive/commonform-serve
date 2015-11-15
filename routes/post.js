module.exports = post

var concat = require('concat-stream')
var merkleize = require('commonform-merkleize')
var validate = require('commonform-validate')

function post(bole, level, request, response) {
  request.pipe(concat(function(buffer) {
    var form
    var error
    try {
      form = JSON.parse(buffer) }
    catch (e) {
      error = e }
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
        batchForms(batch, form, merkle)
        batch.write(function(error) {
          if (error) {
            response.statusCode = 500
            response.end() }
          else {
            response.statusCode = 201
            response.setHeader('Location', location)
            response.end() } }) } } })) }

function batchForms(batch, form, merkle) {
  var stringified = JSON.stringify(form)
  var digest = merkle.digest
  batch.put(digest, stringified)
  form.content
    .forEach(function(element, index) {
      if (isChild(element)) {
        var childForm = element.form
        var childMerkle = merkle.content[index]
        batchForms(batch, childForm, childMerkle) } }) }

function isChild(argument) {
  return (
    typeof argument === 'object' &&
    ( 'form' in argument ) ) }
