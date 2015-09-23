Given a [bole][bole] logger and a [LevelUP][levelup], returns a [standard Node.js HTTP server request listener][http] that stores and serves Common Forms.

Wrapped by [commonform-serve-leveldb][commonform-serve-leveldb]. [commonform-serve-memory][commonform-serve-memory], and [commonform-serve-postgres][commonform-serve-postgres] for their respective storage back ends.

[bole]: https://npmjs.com/packages/bole
[commonform-serve-leveldb]: https://npmjs.com/packages/commonform-serve-leveldb
[commonform-serve-memory]: https://npmjs.com/packages/commonform-serve-memory
[commonform-serve-postgres]: https://npmjs.com/packages/commonform-serve-postgres
[http]: https://nodejs.org/api/http.html
[levelup]: https://npmjs.com/packages/levelup
