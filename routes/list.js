module.exports = function list(bole, level, request, response) {
  level.createKeyStream()
    .on('data', function(key) {
      response.write(( key + '\n' )) })
    .on('end', function() {
      response.end() }) }
