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
    window.addEventListener('popstate', this._onPopState);
    this._globalSpinner = importPolyfill(`${_wordpressConfig.templateUrl}/scripts/pwp-spinner.js`).then(obj => obj.globalSpinner);
  }

  _bindHandlers() {
    this._onLinkClick = this._onLinkClick.bind(this);
    this._onPopState = this._onPopState.bind(this);
  }

  _onPopState(event) {
    this.navigate(location.href, event.state.scrollTop, false);
  }

  async _onLinkClick(event) {
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
    this.navigate(link.toString());
  }

  static get TRANSITION_DURATION() {
    return '0.3s';
  }

  async _animateOut(oldView) {
    oldView.style.transition = `opacity ${Router.TRANSITION_DURATION} linear`;
    oldView.style.opacity = '0';
    return transitionEndPromise(oldView);
  }

  async _animateIn(newView) {
    newView.style.opacity = '0';
    await requestAnimationFramePromise();
    await requestAnimationFramePromise();
    newView.style.transition = `opacity ${Router.TRANSITION_DURATION} linear`;
    newView.style.opacity = '1';
    await transitionEndPromise(newView);
  }

  _loadFragment(link) {
    const newView = document.createElement('pwp-view');
    newView.fragmentURL = link;
    return newView;
  }

  async navigate(link, scrollTop = 0, pushState = true) {
    const oldView = document.querySelector('pwp-view');
    const animation = this._animateOut(oldView);
    const newView = this._loadFragment(link);
    await animation;
    const globalSpinner = await this._globalSpinner;
    if(await Promise.race([newView.ready, timeoutPromise(500)]) === 'timeout') {
      globalSpinner.ready.then(_ => globalSpinner.show());
    }
    if(pushState) history.replaceState({scrollTop: document.scrollingElement.scrollTop}, '');
    await newView.ready;
    globalSpinner.ready.then(_ => globalSpinner.hide());
    document.scrollingElement.scrollTop = scrollTop;
    oldView.parentNode.replaceChild(newView, oldView);
    if(pushState) history.pushState({scrollTop}, '', link);
    await this._animateIn(newView);
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

function timeoutPromise(ms, name = 'timeout') {
  return new Promise(resolve => setTimeout(_ => resolve(name), ms));
}

const instance = new Router();
export {Router, instance};
