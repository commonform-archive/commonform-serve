function badMethodRoute(request, response) {
  response.statusCode = 405;
  response.end();
}

module.exports = badMethodRoute;
