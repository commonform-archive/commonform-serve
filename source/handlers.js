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
    pattern: '/forms/:id',
    function: require('./routes/forms-by-digest')
  },
  {
    pattern: '/bookmarks/:id',
    function: require('./routes/bookmarks')
  }
];
