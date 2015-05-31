var meta = require('../package');

module.exports = {
  swagger: '2.0',
  info: {
    title: meta.name,
    description: meta.description,
    version: meta.version
  },
  definitions: require('./definitions'),
  parameters: require('./parameters'),
  produces: ['application/json'],
  paths: require('./paths')
};

if (!module.parent) {
  console.log(JSON.stringify(module.exports));
}
