var badInputRoute = require('./bad-input');
var badMethodRoute = require('./bad-method');
var concat = require('concat-stream');
var notFoundRoute = require('./not-found');
var version = require('../../package').version;

function bookmarksRoute(request, response, parameters, splats, level) {
  var bookmark = parameters.bookmark;
  if (request.method === 'POST') {
    request.pipe(concat(function(buffer) {
      var digest = buffer.toString();
      level.putBookmark(digest, bookmark, function(error) {
        if (error) {
          if (error.invalidDigest || error.invalidBookmark) {
            badInputRoute(request, response);
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
  } else if (request.method === 'GET') {
    level.getBookmark(bookmark, function(error, digest) {
      if (error) {
        if (error.notFound) {
          notFoundRoute(request, response);
        } else {
          request.log.error(error);
          response.statusCode = 500;
          response.end();
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
