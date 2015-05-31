module.exports = [
  {
    pattern: '/',
    function: require('./index')
  },
  {
    pattern: '/forms',
    function: require('./forms')
  },
  {
    pattern: '/forms/:id',
    function: require('./forms-by-digest')
  },
  {
    pattern: '/bookmarks/:id',
    function: require('./bookmarks')
  }
];
