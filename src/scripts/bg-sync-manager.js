/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  class BgSyncManager {
    static generateUID() {
      return `${Date.now()}-${performance.now()}`;
    }
    constructor() {
      this._dbPromise = idb.open('bgsyncs', 1, upgradeDB => {
        switch (upgradeDB.oldVersion) {
          case 0:
            upgradeDB.createObjectStore('requests', {keyPath: 'id'});
        }
      });
    }

    async enqueue(request) {
      const db = await this._dbPromise;
      const body = await request.arrayBuffer();
      await db
        .transaction('requests', 'readwrite')
        .objectStore('requests')
        .put({
          id: BgSyncManager.generateUID(),
          url: request.url,
          headers: Array.from(request.headers),
          method: request.method,
          body,
        })
        .complete;
        return;
    }

    async getAll() {
      const db = await this._dbPromise;
      return db
        .transaction('requests')
        .objectStore('requests')
        .getAll();
    }

    async delete(request) {
      const db = await this._dbPromise;
      await db
        .transaction('requests', 'readwrite')
        .objectStore('requests')
        .delete(request.id)
        .complete;
      return;
    }

    async numPending() {
      const db = await this._dbPromise;
      return db
        .transaction('requests')
        .objectStore('requests')
        .count();
    }
  }

  self._bgSyncManager = new BgSyncManager();
})();


