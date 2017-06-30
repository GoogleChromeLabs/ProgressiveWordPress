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

_pubsubhub.subscribe('navigation', _ => updateLinks());

window.addEventListener('offline', _ => goOffline());
window.addEventListener('online', _ => goOnline());

if(navigator.onLine)
  goOnline();
else
  goOffline();

function goOnline() {
  document.body.classList.remove('offline');
  document.body.classList.add('online');
  updateLinks();
}

function goOffline() {
  document.body.classList.add('offline');
  document.body.classList.remove('online');
  updateLinks();
}

function updateLinks() {
  Array.from(document.querySelectorAll('article.preview'))
    .forEach(article => {
      const link = new URL(article.querySelector('a.headline').href);
      link.searchParams.set('fragment', 'true');
      caches.match(link.toString())
        .then(resp => {
          const isAvailableOffline = !!resp;
          article.classList.toggle('cached', isAvailableOffline);
          if(isAvailableOffline) {
            article.querySelector('.download').innerText = 'Available for offline reading';
          }
        });
    });
}
