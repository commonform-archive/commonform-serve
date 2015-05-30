module.exports = [
  {
    pattern: '/',
    function: require('./routes/index')
  },
  {
    pattern: '/forms',
    function: require('./routes/forms')
  },
  {
    pattern: '/forms/:digest',
    function: require('./routes/forms-by-digest')
  },
  {
    pattern: '/bookmarks/:bookmark',
    function: require('./routes/bookmarks')
  }
];
