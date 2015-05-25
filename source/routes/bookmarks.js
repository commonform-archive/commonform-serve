var badInput = require('./bad-input');
var badMethodRoute = require('./bad-method');
var concat = require('concat-stream');

function bookmarksRoute(request, response, parameters, splats, level) {
  if (request.method === 'POST') {
    var bookmark = parameters.bookmark;
    request.pipe(concat(function(buffer) {
      var digest = buffer.toString();
      level.putBookmark(digest, bookmark, function(error) {
        if (error) {
          if (error.invalidDigest || error.invalidBookmark) {
            badInput(request, response);
          } else {
            request.log.error(error);
            response.statusCode = 500;
            response.end();
          }
        } else {
          response.statusCode = 201;
          response.setHeader('location', '/bookmarks/' + bookmark);
          response.end();
        }
      });
    }));
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = bookmarksRoute;
