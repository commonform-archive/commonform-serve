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

var concat = require('concat-stream')
var http = require('http')
var meta = require('../package.json')
var server = require('./server')
var tape = require('tape')

tape('GET /', function(test) {
  server(function(port, done) {
    var request = { path: '/', port: port }
    http.get(request, function(response) {
      test.equal(response.statusCode, 200, 'responds 200')
      response.pipe(concat(function (buffer) {
        test.same(
          JSON.parse(buffer),
          { service: meta.name, version: meta.version },
          'serves JSON with service name and version')
        done()
        test.end() })) }) }) })

tape('POST /', function(test) {
  server(function(port, done) {
    var request = { path: '/', method: 'POST', port: port }
    http.get(request, function(response) {
      test.equal(response.statusCode, 405, 'responds 405')
      done()
      test.end() }) }) })
