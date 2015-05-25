module.exports = function notFoundRoute(request, response) {
  response.statusCode = 404;
  response.end();
};
