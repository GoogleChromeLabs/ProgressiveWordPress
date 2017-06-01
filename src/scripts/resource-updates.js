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

import './pwp-notification.js';

let hasBeenPromptedForReload = false;

const coreItemDetectors = [
  /surmblog\/header.php$/i,
  /surmblog\/footer.php$/i,
];

const handlers = {
  resource_update: event => {
    const rsrc = new URL(event.data.name);
    const isCoreItem = coreItemDetectors.some(d => d.test(rsrc.pathname));
    const isCurrentItem = rsrc.pathname === new URL(location.href).pathname;
    console.log(`${rsrc.pathname} (${new URL(location.href).pathname}): core=${isCoreItem}, current=${isCurrentItem}`);
    if(isCoreItem || isCurrentItem) {
      console.log(`Update: ${event.data.name}`);
      promptForReload();
    }
  },
};

function promptForReload() {
  if(hasBeenPromptedForReload) return;
  const prompt = document.createElement('pwp-notification');
  prompt.innerHTML = `
    The contents of this page have been updated. Please <a href="javascript:location.reload()">reload</a>
  `;
  document.body.appendChild(prompt);
  prompt.show();
  hasBeenPromptedForReload = true;
}

export const handler = function(event) {
  if(event.data.type in handlers && typeof handlers[event.data.type] === 'function')
    return handlers[event.data.type](event);
  console.error('Unknown postMessage:', event);
};

