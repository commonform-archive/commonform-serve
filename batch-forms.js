module.exports = batchForms

var stringify = require('commonform-serialize').stringify
var isChild = require('commonform-predicate').child

function batchForms(batch, form, merkle) {
  var stringified = stringify(form)
  var digest = merkle.digest
  batch.put(digest, stringified)
  form.content
    .forEach(function(element, index) {
      if (isChild(element)) {
        var childForm = element.form
        var childMerkle = merkle.content[index]
        batchForms(batch, childForm, childMerkle) } }) }
