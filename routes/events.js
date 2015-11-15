var meta = require('../package.json')

var HEARTBEAT = ':\n'
var HEARTRATE = ( 1000 * 15 )

module.exports = function events(bole, level, request, response) {
  response.writeHead(200, { 'Content-Type': 'text/event-stream' })
  // Write events to the response for each subsequent write to the LevelUp.
  level
    .on('put', function(key) {
      writeEvent(response, key) })
    .on('batch', function(batch) {
      batch
        .forEach(function(operation) {
          if (operation.type === 'put') {
            writeEvent(response, operation.key) } }) })
  // Send a comment with service name and version to start.
  response.write(':' + meta.name + ' version ' + meta.version + '\n')
  // Send a comment at regular interval to keep the response alive.
  var heartbeatInterval = setInterval(
    function() {
      response.write(HEARTBEAT) },
    HEARTRATE)
  // Stop heartbeats When the response closes.
  response
    .on('close', function() {
      clearInterval(heartbeatInterval) }) }

function writeEvent(response, data) {
  response.write('data:' + data + '\n\n') }
