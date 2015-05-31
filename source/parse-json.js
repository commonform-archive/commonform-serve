function parseJSON(input, callback) {
  var json;
  try {
    json = JSON.parse(input);
  } catch (e) {
    return callback(e);
  }
  callback(null, json);
}

module.exports = parseJSON;
