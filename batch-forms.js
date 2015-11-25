module.exports = batchForms

var stringify = require('commonform-serialize').stringify
var isChild = require('commonform-predicate').child

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
