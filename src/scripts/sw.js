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

importScripts(`${_wordpressConfig.templateUrl}/scripts/transformstream.js`);

const VERSION = '{%VERSION%}';

self.oninstall = event => {
  event.waitUntil(async function() {
    const cache = await caches.open('pwp');
    await cache.addAll([
      `${_wordpressConfig.templateUrl}/header.php?fragment=true`,
      `${_wordpressConfig.templateUrl}/?fragment=true`,
      `${_wordpressConfig.templateUrl}/footer.php?fragment=true`,
      `${_wordpressConfig.templateUrl}/lazy.css`,
      `${_wordpressConfig.templateUrl}/scripts/router.js`,
      `${_wordpressConfig.templateUrl}/scripts/pwp-view.js`,
      `${_wordpressConfig.templateUrl}/scripts/pwp-spinner.js`,
    ]);
    // TODO Need to broadcast changes here
    return self.skipWaiting();
  }());
};

self.onactivate = event => {
  event.waitUntil(self.clients.claim());
}

self.onfetch = event => {
  if(isWpRequest(event.request))
    return fetch(event.request);
  if(isFragmentRequest(event.request) || isAssetRequest(event.request))
    return event.respondWith(staleWhileRevalidate(event.request, event.waitUntil.bind(event)));

  const newRequestURL = new URL(event.request.url);
  newRequestURL.searchParams.append('fragment', 'true');

  const responsePromises = [
    `${_wordpressConfig.templateUrl}/header.php?fragment=true`,
    newRequestURL,
    `${_wordpressConfig.templateUrl}/footer.php?fragment=true`,
  ].map(u => staleWhileRevalidate(new Request(u), event.waitUntil.bind(event)));

  const {readable, writable} = new TransformStream();
  event.waitUntil(async function() {
    for (const responsePromise of responsePromises) {
      const response = await responsePromise;
      await response.body.pipeTo(writable, {preventClose: true});
    }
    writable.getWriter().close();
  }());
  event.respondWith(new Response(readable));
};

function isFragmentRequest(request) {
  return new URL(request.url).searchParams.get('fragment') === 'true';
}

function isAssetRequest(request) {
  return /(jpe?g|png|css|js)$/i.test(request.url);
}

function isWpRequest(request) {
  const parsedUrl = new URL(request.url);
  return /^\/wp-/i.test(parsedUrl.pathname) && !parsedUrl.pathname.startsWith('/wp-content');
}

async function broadcast(msg) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage(msg));
}

async function staleWhileRevalidate(request, waitUntil) {
  const networkResponsePromise = fetch(request).catch(_ => {});
  const cacheResponsePromise = caches.match(request);

  // Update cache
  waitUntil(async function () {
    const cache = await caches.open('pwp');
    const networkResponse = await networkResponsePromise;
    const cacheResponse = await cacheResponsePromise;
    if(networkResponse && cacheResponse) {
      const changed = networkResponse.headers.get('Etag') !== cacheResponse.headers.get('Etag');
      if(changed) await broadcast({type: 'resource_update', name: request.url});
    }
    if(networkResponse) {
       cache.put(request, networkResponse.clone());
    }
  }());

  // Determine response
  const cacheResponse = await cacheResponsePromise;
  if (cacheResponse) return cacheResponse;
  const networkResponse = await networkResponsePromise;
  if(networkResponse) return networkResponse.clone();
  throw new Error('Neither network nor cache had a response')
}
