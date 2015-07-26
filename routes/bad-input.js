function badInputRoute(request, response) {
  response.statusCode = 400;
  response.end();
}

module.exports = badInputRoute;
