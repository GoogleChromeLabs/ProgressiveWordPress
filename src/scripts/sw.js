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
    const cache = await caches.open('pwp-static');
    await cache.addAll([
      `${_wordpressConfig.templateUrl}/header.php?fragment=true`,
      `${_wordpressConfig.templateUrl}/?fragment=true`,
      `${_wordpressConfig.templateUrl}/footer.php?fragment=true`,
      `${_wordpressConfig.templateUrl}/style.css`,
      `${_wordpressConfig.templateUrl}/scripts/router.js`,
      `${_wordpressConfig.templateUrl}/scripts/pwp-view.js`,
      `${_wordpressConfig.templateUrl}/scripts/pwp-spinner.js`,
    ])
    return self.skipWaiting();
  }());
};

self.onactivate = event => {
  event.waitUntil(self.clients.claim());
}

self.onfetch = event => {
  if(isFragmentRequest(event.request) || isAssetRequest(event.request)) {
    return event.respondWith(staleWhileRevalidate(event.request, event.waitUntil.bind(event)));
  }

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

async function staleWhileRevalidate(request, waitUntil) {
  const networkResponsePromise = fetch(request);
  const cacheResponse = await caches.match(request);
  waitUntil(async function () {
    const cache = await caches.open('pwp-dynamic');
    return cache.put(request, (await networkResponsePromise).clone());
  }());

  return cacheResponse ? cacheResponse : (await networkResponsePromise).clone();
}
