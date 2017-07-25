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
  const TAG_TO_STORE = {
    'comment-sync': 'requests',
    'ga-sync': 'ga-requests',
  };

  async function serializeRequest(request) {
    const body = (request.method === 'POST') ? await request.arrayBuffer() : null;
    return {
      url: request.url,
      headers: Array.from(request.headers),
      method: request.method,
      credentials: request.credentials,
      referrer: request.referrer,
      mode: request.mode,
      body,
    };
  }

  async function deserializeRequest(obj) {
    return new Request(obj.url, obj);
  }

  class BgSyncManager {
    constructor() {
      this._dbPromise = idb.open('bgsyncs', 2, upgradeDB => {
        switch (upgradeDB.oldVersion) {
          case 0:
            upgradeDB.createObjectStore('requests', {keyPath: 'id'});
          case 1:
            upgradeDB.createObjectStore('ga-requests', {keyPath: 'id'});
        }
      });
    }

    generateUID() {
      return `${Date.now()}-${performance.now()}`;
    }

    get supportsBackgroundSync() {
      return 'SyncManager' in self;
    }

    async syncManager() {
      let registration = self.registration;
      if(!registration) {
        try {
          registration = await navigator.serviceWorker.getRegistration();
        } catch(e) {}
      }
      return registration.sync;
    }

    async trigger(tagName = 'comment-sync') {
      return (await this.syncManager()).register(tagName);
    }

    async isSyncing(tagName = 'comment-sync') {
      const manager = await this.syncManager();
      const tags = await manager.getTags();
      return tags.includes(tagName);
    }

    async enqueue(request, {dbName = 'requests'} = {}) {
      const db = await this._dbPromise;
      const obj = await serializeRequest(request);
      await db
        .transaction(dbName, 'readwrite')
        .objectStore(dbName)
        .put(Object.assign(
          obj,
          {id: this.generateUID()}
        ))
        .complete;
      return;
    }

    async getAll({dbName = 'requests'} = {}) {
      const db = await this._dbPromise;
      const objs = await db
        .transaction(dbName)
        .objectStore(dbName)
        .getAll();
      return Promise.all(objs.map(async obj => ({request: await deserializeRequest(obj), id: obj.id})));
    }

    async delete(id, {dbName = 'requests'} = {}) {
      const db = await this._dbPromise;
      await db
        .transaction(dbName, 'readwrite')
        .objectStore(dbName)
        .delete(id)
        .complete;
      return;
    }

    async numPending({dbName = 'requests'} = {}) {
      const db = await this._dbPromise;
      return db
        .transaction(dbName)
        .objectStore(dbName)
        .count();
    }

    process(event) {
      event.waitUntil((async _ => {
        if(!(event.tag in TAG_TO_STORE)) return;
        const dbName = TAG_TO_STORE[event.tag];
        const pending = await this.getAll({dbName});
        await Promise.all(
          pending.map(async request => {
            try {
              await fetch(request.request);
              await _bgSyncManager.delete(request.id, {dbName});
            } catch(e) {}
          })
        );
        const numPending = await _bgSyncManager.numPending({dbName});
        if(event.tag === 'comment-sync')
          _pubsubhub.dispatch('comment_update');
        if(numPending > 0) return Promise.reject();
        return;
      })());
    }
  }

  self._bgSyncManager = new BgSyncManager();
})();


