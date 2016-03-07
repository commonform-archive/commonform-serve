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

module.exports = function list(bole, level, request, response) {
  var keyCount = 0
  level.createKeyStream({ fillCache: false })
    .on('data', function(key) {
      keyCount++
      response.write(( key + '\n' )) })
    .once('error', /*istanbul ignore next */ function(error) {
      bole.error(error) })
    .once('end', function() {
      bole.info({ event: 'Served List', keys: keyCount })
      response.end() }) }
