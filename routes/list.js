module.exports = function list(bole, level, request, response) {
  var keyCount = 0
  level.createKeyStream()
    .on('data', function(key) {
      keyCount++
      response.write(( key + '\n' )) })
    .once('error', /*istanbul ignore next */ function(error) {
      bole.error(error) })
    .once('end', function() {
      bole.info({ event: 'Served List', keys: keyCount })
      response.end() }) }
