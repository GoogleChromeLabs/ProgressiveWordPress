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

import './intersectionobserver-polyfill.js';

const io = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting)
        entry.target.full = true;
    });
  }, {
  rootMargin: "50px",
  threshold: 0,
});


const styleTemplate = data => `
  <style>
    :host {
      display: block;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url(${data.background});
    }
    :host:before {
      display: block;
      content: '';
      padding-top: ${data.aspectRatio*100}%;
    }
  </style>
`;

class PwpLazyImage extends HTMLElement {
  static get observedAttributes() {
    return ['full', 'src'];
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = styleTemplate({
      background: '',
      aspectRatio: this.height / this.width,
    });
    io.observe(this);
  }

  disconnectedCallback() {
    io.unobserve(this);
  }

  attributeChangedCallback(name) {
    if(!this.full) return
    const img = document.createElement('img');
    img.src = this.src;
    img.onload = _ => {
      this.style.backgroundImage = '';
      this.shadowRoot.innerHTML = styleTemplate({
        background: this.src,
        aspectRatio: this.height / this.width,
      });
    };
  }

  get full() {
    return this.hasAttribute('full');
  }

  set full(val) {
    val = Boolean(val);
    if(val)
      this.setAttribute('full', '');
    else
      this.removeAttribute('full');
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(val) {
    this.setAttribute('src', val);
  }

  get width() {
    if(this.hasAttribute('width')) return this.getAttribute('width');
    return 1;
  }

  get height() {
    if(this.hasAttribute('height')) return this.getAttribute('height');
    return 1;
  }

  show() {

    const img = document.createElement('img');
    img.src = this.getAttribute('src');
    img.onload = _ => this.style.backgroundImage = `url(${img.src})`;
  }
}
customElements.define('pwp-lazy-image', PwpLazyImage);
