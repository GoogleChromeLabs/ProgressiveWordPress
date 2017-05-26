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

class Router {
  constructor() {
    this._bindHandlers();
    this._hostname = location.host;
    document.addEventListener('click', this._onLinkClick);
  }

  _bindHandlers() {
    this._onLinkClick = this._onLinkClick.bind(this);
  }

  _onLinkClick(event) {
    if(event.target.tagName !== 'A') return;
    const link = new URL(event.target.href);
    // If it’s an external link, just navigate.
    if(link.host !== this._hostname) {
      return;
    }
    // We also navigate normally for admin links
    if(link.pathname.startsWith('/wp-admin')) {
      document.location.href = link;
      return;
    }

    event.preventDefault();
    this.navigate(event.target.href);
  }

  static get TRANSITION_DURATION() {
    return '0.3s';
  }

  async navigate(link) {
    // console.log('internal link – navigate for now');
    // document.location.href = link.href;
    const oldView = document.querySelector('pwp-view');
    const newView = document.createElement('pwp-view');
    newView.templateURL = 'https://surmblog.dev:8080/wp-content/themes/surmblog/post.mustache'; // FIXME
    newView.dataURL = link.toString();
    newView.style.opacity = '0';

    oldView.style.transition = `opacity ${Router.TRANSITION_DURATION} linear`;
    oldView.style.opacity = '0';
    await transitionEndPromise(oldView);
    await newView.ready;
    oldView.parentNode.replaceChild(newView, oldView);
    newView.style.transition = `opacity ${Router.TRANSITION_DURATION} linear`;
    await requestAnimationFramePromise();
    await requestAnimationFramePromise();
    newView.style.opacity = '1';
    await transitionEndPromise(newView);
    console.log('Transition done');
  }
}

function transitionEndPromise(element) {
  return new Promise(resolve => {
    element.addEventListener('transitionend', function f() {
      element.removeEventListener('transitionend', f);
      resolve();
    });
  });
}

function requestAnimationFramePromise() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

const instance = new Router();
export {Router, instance};
