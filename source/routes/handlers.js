module.exports = [
  {
    pattern: '/', function: require('./index')
  },
  {
    pattern: '/swagger.json', function: require('./swagger')
  },
  {
    pattern: '/bookmarks/:id',
    function: require('./bookmarks')
  },
  {
    pattern: '/forms',
    function: require('./forms')
  },
  {
    pattern: '/forms/:id',
    function: require('./forms-by-digest')
  }
];
