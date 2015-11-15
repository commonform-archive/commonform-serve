module.exports = function(input, callback) {
  var error
  var result
  try {
    result = JSON.parse(input) }
  catch (e) {
    error = e }
  callback(error, result) }
