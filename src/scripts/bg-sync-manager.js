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
  async function serializeRequest(request) {
    const body = await request.arrayBuffer();
    return {
      url: request.url,
      headers: Array.from(request.headers),
      method: request.method,
      credentials: request.credentials,
      referrer: request.referrer,
      body,
    };
  }

  async function deserializeRequest(obj) {
    return new Request(obj.url, obj);
  }

  class BgSyncManager extends Observable {
    constructor() {
      super();
      this._dbPromise = idb.open('bgsyncs', 1, upgradeDB => {
        switch (upgradeDB.oldVersion) {
          case 0:
            upgradeDB.createObjectStore('requests', {keyPath: 'id'});
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

    async trigger() {
      return (await this.syncManager()).register('comment-sync');
    }

    async isSyncing() {
      const manager = await this.syncManager();
      const tags = await manager.getTags();
      return tags.includes('comment-sync');
    }

    async enqueue(request) {
      const db = await this._dbPromise;
      const obj = await serializeRequest(request);
      await db
        .transaction('requests', 'readwrite')
        .objectStore('requests')
        .put(Object.assign(
          obj,
          {id: this.generateUID()}
        ))
        .complete;
      return;
    }

    async getAll() {
      const db = await this._dbPromise;
      const objs = await db
        .transaction('requests')
        .objectStore('requests')
        .getAll();
      return Promise.all(objs.map(async obj => ({request: await deserializeRequest(obj), id: obj.id})));
    }

    async delete(id) {
      const db = await this._dbPromise;
      await db
        .transaction('requests', 'readwrite')
        .objectStore('requests')
        .delete(id)
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

    process(event) {
      event.waitUntil((async _ => {
        const pending = await this.getAll();
        await Promise.all(
          pending.map(async request => {
            try {
              await fetch(request.request);
              await _bgSyncManager.delete(request.id);
            } catch(e) {}
          })
        );
        const numPending = await _bgSyncManager.numPending();
        const clients = await self.clients.matchAll();
        clients.forEach(client => client.postMessage({type: 'comment_update', numPending}));
        if(numPending > 0) return Promise.reject();
        return;
      })());
    }
  }

  self._bgSyncManager = new BgSyncManager();
})();


