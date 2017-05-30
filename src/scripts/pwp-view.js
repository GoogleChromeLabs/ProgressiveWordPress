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

class PwpView extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['fragment-url'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if(this.rendered) return;
    const fragmentURL = new URL(newVal);
    fragmentURL.searchParams.append('fragment', 'true');
    this._ready = (async _ => {
      let fragment;
      try {
        fragment = await fetch(fragmentURL.toString()).then(resp => resp.text());
      } catch(e) {
        fragment = 'This content is not available.';
      }
      this.innerHTML = fragment;
    })();
  }

  get ready() {
    if(this._ready)
      // Make sure we resolve to undefined.
      return this._ready.then(_ => {});
    return Promise.resolve()
  }

  get fragmentURL() {
    return this.getAttribute('fragment-url');
  }

  set fragmentURL(val) {
    this.setAttribute('fragment-url', val);
  }

  get rendered() {
    return this.hasAttribute('rendered');
  }

  set rendered(val) {
    if(Boolean(val))
      this.setAttribute('rendered', '');
    else
      this.removeAttribute('rendered');
  }
}
customElements.define('pwp-view', PwpView);
