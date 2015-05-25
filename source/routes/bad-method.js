module.exports = function badMethodRoute(request, response) {
  response.statusCode = 405;
  response.end();
};
