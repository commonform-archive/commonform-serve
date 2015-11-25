This package exports a factory function for generating HTTP server response handler functions usable with [Node.js core HTTP servers](https://nodejs.org/api/http.html). The generator function requires a [bole logger](https://www.npmjs.com/packages/bole) and a [LevelUp-compatible data store](https://www.npmjs.com/packages/levelup).

The server responds to endpoints for a number of purposes:

1. Store and serve Common Forms.
2. List Common Forms stored by digest.
3. Register HTTP POST callbacks for notification of new Common Forms.
4. Serve metadata about the service and its version.
