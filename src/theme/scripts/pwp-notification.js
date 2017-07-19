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

import {TransitionAnimator} from './transition-animator.js';
class PwpNotification extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.style.position = 'fixed';
    this.style.left = '0';
    this.style.right = '0';
    this.style.bottom = '0';
    this.style.display = 'none';
  }

  async show() {
    this.style.display = '';
    this.style.opacity = '0';
    await requestAnimationFramePromise();
    await requestAnimationFramePromise();
    this.style.transition = `opacity ${TransitionAnimator.TRANSITION_DURATION} ${TransitionAnimator.TRANSITION_F}`;
    this.style.opacity = '1';
  }
}
customElements.define('pwp-notification', PwpNotification);

function requestAnimationFramePromise() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}
