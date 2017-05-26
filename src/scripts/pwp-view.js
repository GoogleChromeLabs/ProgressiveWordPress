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
    return ['data-url'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if(this.rendered) return;
    const dataURL = new URL(newVal);
    dataURL.searchParams.append('json', 'true');
    this._ready = (async _ => {
      const [data, template] = await Promise.all([
        fetch(dataURL.toString()).then(resp => resp.json()),
        fetch(this.templateURL).then(resp => resp.text()),
      ]);
      this.textContent = JSON.stringify(data) + '\n' + template;
    })();
  }

  get ready() {
    if(this._ready)
      // Make sure we resolve to undefined.
      return this._ready.then(_ => {});
    return Promise.resolve()
  }

  get dataURL() {
    return this.getAttribute('data-url');
  }

  set dataURL(val) {
    this.setAttribute('data-url', val);
  }

  get templateURL() {
    return this.getAttribute('template-url');
  }

  set templateURL(val) {
    this.setAttribute('template-url', val);
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
