/* Copyright 2015 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = startTestServer

var bole = require('bole')
var handler = require('../')
var http = require('http')
var levelup = require('levelup')
var memdown = require('memdown')

function startTestServer(callback, port) {
  // Binding to port zero instructs the OS to assign a random high port.
  port = ( port || 0 )
  // Initialze the two module's two arguments.
  var log = bole('test')
  // Use an memdown, an in-memory store for testing.
  var level = levelup('', { db: memdown })
  // If we are binging to a specified port, rather than a random one, print log
  // output to stdout.
  if (port !== 0) {
    bole.output([
      { level: 'debug', stream: process.stdout },
      { level: 'info', stream: process.stdout },
      { level: 'warn', stream: process.stdout },
      { level: 'error', stream: process.stdout } ]) }
  http.createServer(handler(log, level))
    .listen(port, function() {
      // Call back with the port assigned by the operating system.
      callback(
        this.address().port,
        this.close.bind(this)) }) }

// Run this script with `node test/server.js` to start a test server on port
// 8080. Log messages will go to stdout.
if (!module.parent) {
  var port = ( process.env.PORT || 8080 )
  startTestServer(
    function(port) {
      process.stdout.write('Listening on port ' + port + '\n') },
    port) }
