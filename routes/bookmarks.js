var badInputRoute = require('./bad-input');
var badMethodRoute = require('./bad-method');
var concat = require('concat-stream');
var internalErrorRoute = require('./internal-error');
var notFoundRoute = require('./not-found');
var version = require('../package').version;

// Handle requests to post or get bookmarks.
function bookmarksRoute(request, response, parameters, splats, level) {
  var bookmark = parameters.id;

  // POST bookmark
  if (request.method === 'POST') {
    request.pipe(concat(function(buffer) {
      var digest = buffer.toString();
      level.putBookmark(digest, bookmark, function(error) {
        if (error) {
          if (error.invalidDigest || error.invalidBookmark) {
            badInputRoute(request, response);
          } else {
            internalErrorRoute(error, request, response);
          }
        } else {
          response.statusCode = 201;
          response.setHeader('location', '/bookmarks/' + bookmark);
          response.end();
        }
      });
    }));

  // GET bookmark
  } else if (request.method === 'GET') {
    level.getBookmark(bookmark, function(error, digest) {
      if (error) {
        if (error.notFound) {
          notFoundRoute(request, response);
        } else {
          internalErrorRoute(error, request, response);
        }
      } else {
        response.end(JSON.stringify({
          bookmark: bookmark,
          digest: digest,
          version: version
        }));
      }
    });
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = bookmarksRoute;
