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

(function() {
  function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  class Observable {
    constructor() {
      this._subscribers = new Set();
    }

    subscribe(fn) {
      this._subscribers.add(fn);

      return {
        unsubscribe: _ => this._subscribers.delete(fn),
      };
    }

    dispatch(thing) {
      for(let subscriber of this._subscribers) {
        subscriber(thing);
      }
    }
  }

  class PubSubHub {
    constructor() {
      this._observables = new Map();
      const handler = this._handler.bind(this);
      if(isBrowser())
        navigator.serviceWorker.addEventListener('message', handler)
      else
        self.addEventListener('message', handler);
    }

    async _postMessageOtherSide(...args) {
      if(isBrowser()) return this._postMessageServiceWorker(...args);
      return this._postMessageAllClients(...args)
    }

    async _postMessageServiceWorker(...args) {
      const registration = await navigator.serviceWorker.getRegistration();
      if(!registration.active) return;
      return registration.active.postMessage(...args)
    }

    async _postMessageAllClients(...args) {
      const clients = await self.clients.matchAll(...args);
      for(const client of clients) {
        client.postMessage(...args);
      }
    }

    async _handler(event) {
      const topic = event.data.topic;
      if(this._observables.has(topic)) {
        this._observables.get(topic).dispatch(event.data.data);
      }
    }

    async dispatch(topic, data = {}) {
      const msg = {data, realm: isBrowser()?'browser':'serviceworker', topic};
      await this._postMessageOtherSide(msg);
      if(this._observables.has(topic)) {
        this._observables.get(topic).dispatch(data);
      }
    }

    subscribe(topic, f) {
      let obs;
      if(!this._observables.has(topic)) {
        obs = new Observable();
        this._observables.set(topic, obs);
      } else {
        obs = this._observables.get(topic);
      }
      return obs.subscribe(f);
    }
  }

  self._pubsubhub = new PubSubHub();
})();
