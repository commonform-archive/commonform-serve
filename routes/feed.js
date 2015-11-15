module.exports = feed

var livefeed = require('level-livefeed')

function feed(bole, level, request, response) {
  var stream = livefeed(level)
  stream
    .on('data', function(chunk) {
      response.write(
        ( JSON.stringify(
            { type: chunk.type,
              key: chunk.key.toString(),
              value: JSON.parse(chunk.value) }) +
          '\n' )) }) }
