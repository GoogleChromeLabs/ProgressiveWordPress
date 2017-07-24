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

class TransitionAnimator {
  static get TRANSITION_DURATION() {
    return '0.5s';
  }

  static get TRANSITION_F() {
    return 'cubic-bezier(0.230, 1.000, 0.320, 1.000)';
  }

  constructor() {
    this._header = document.querySelector('header.hero');
    this._footer = document.querySelector('footer.footer');
  }

  get isSingle() {
    return this._header.classList.contains('single');
  }

  get isFull() {
    return !this.isSingle;
  }

  async toFull() {
    if(this.isFull) return _=>{};

    const ribbon = this._header.querySelector('.ribbon');
    const text = this._header.querySelector('a');
    const singleRect = this._header.getBoundingClientRect();
    this._header.classList.remove('single');
    const ribbonRect = ribbon.getBoundingClientRect();
    this._header.classList.add('single');

    // Footer down
    const a1 = (async function() {
      this._footer.style.transition = `transform ${TransitionAnimator.TRANSITION_DURATION} ${TransitionAnimator.TRANSITION_F}`;
      this._footer.style.transform = 'translateY(100%)';
    }.bind(this))();
    // Text out
    const a2 = (async function() {
      text.style.opacity = 1;
      await requestAnimationFramePromise();
      await requestAnimationFramePromise();
      text.style.transition = `opacity ${TransitionAnimator.TRANSITION_DURATION} linear`;
      text.style.opacity = 0;
      await transitionEndPromise(text);
      text.style.transition = '';
    }.bind(this))();

    await Promise.all([a1, a2]);

    return async function() {
      this._header.classList.remove('single');
      // Ribbon right
      const a1 = (async function() {
        this._header.style.transform = `translateY(calc(-100% + ${singleRect.height}px))`;
        await requestAnimationFramePromise();
        await requestAnimationFramePromise();
        this._header.style.transition = `transform ${TransitionAnimator.TRANSITION_DURATION} ${TransitionAnimator.TRANSITION_F}`;
        this._header.style.transform =  '';
        await transitionEndPromise(this._header);
      }.bind(this))();

      // Header down
      const a2 = (async function() {
        text.style.opacity = '';
        ribbon.style.transform = `translateX(-${ribbonRect.right+32}px)`;
        await requestAnimationFramePromise();
        await requestAnimationFramePromise();
        ribbon.style.transition = `transform ${TransitionAnimator.TRANSITION_DURATION} ${TransitionAnimator.TRANSITION_F} 0.1s`;
        ribbon.style.transform =  '';
        await transitionEndPromise(ribbon);
      }.bind(this))();

      // Footer up
      const a3 = (async function() {
        this._footer.style.transform = 'translateY(0)';
        await transitionEndPromise(this._footer);
        this._footer.style.transition = this._footer.style.transform = '';
      }.bind(this))();

      await Promise.all([a1, a2, a3])
      this._header.style.transition = '';
      this._header.style.transform = '';
      ribbon.style.transition = '';
      ribbon.style.transform = '';
    }.bind(this);
  }

  async toSingle(switchContent) {
    if(this.isSingle) return _=>{};
    const scrollPos = document.scrollingElement.scrollTop;
    const ribbon = this._header.querySelector('.ribbon');
    const text = this._header.querySelector('a');
    const ribbonRect = ribbon.getBoundingClientRect();
    this._header.classList.add('single');
    const singleRect = this._header.getBoundingClientRect();
    this._header.classList.remove('single');
    document.scrollingElement.scrollTop = scrollPos;
    const headerInViewAtStart = ribbonRect.bottom > 0;
    const headerInViewAtFadeIn = singleRect.bottom > 0;

    // Footer down
    (async function() {
      this._footer.style.transition = `transform ${TransitionAnimator.TRANSITION_DURATION} ${TransitionAnimator.TRANSITION_F}`;
      this._footer.style.transform = 'translateY(100%)';
    }.bind(this))();

    if(headerInViewAtStart) {
      // Ribbon left
      const a1 = (async function() {
        ribbon.style.transition = `transform ${TransitionAnimator.TRANSITION_DURATION} ${TransitionAnimator.TRANSITION_F}`;
        await requestAnimationFramePromise();
        await requestAnimationFramePromise();
        ribbon.style.transform = `translateX(-${ribbonRect.right+32}px)`;
        await transitionEndPromise(ribbon);
      }.bind(this))();

      // Header up
      const a2 = (async function() {
        this._header.style.transition = `transform ${TransitionAnimator.TRANSITION_DURATION} ${TransitionAnimator.TRANSITION_F} 0.2s`;
        await requestAnimationFramePromise();
        await requestAnimationFramePromise();
        this._header.style.transform = `translateY(calc(-100% + ${singleRect.height}px))`;
        await transitionEndPromise(this._header);
      }.bind(this))();

      await Promise.all([a1, a2]);
    }
    ribbon.style.transform = `translateX(-400%)`;
    if(!headerInViewAtFadeIn) {
      this._header.style.transition = '';
      this._header.style.transform = `translateY(-100%)`;
      await requestAnimationFramePromise();
      await requestAnimationFramePromise();
    }
    return async function() {
      // Footer up
      (async function() {
        this._footer.style.transform = 'translateY(0)';
        await transitionEndPromise(this._footer);
        this._footer.style.transition = this._footer.style.transform = '';
      }.bind(this))();

      this._header.classList.add('single');
      ribbon.style.transform = '';
      ribbon.style.transition = '';
      text.style.opacity = 0;
      if(!headerInViewAtFadeIn) {
        document.scrollingElement.scrollTop = 0;
        this._header.style.transition = `transform ${TransitionAnimator.TRANSITION_DURATION} ${TransitionAnimator.TRANSITION_F} 0.2s`;
        this._header.style.transform = `translateY(0)`;
        await transitionEndPromise(this._header);
        this._header.style.transform = this._header.style.transition = '';
      }
      await requestAnimationFramePromise();
      await requestAnimationFramePromise();

      // Text in
      text.style.transition = `opacity ${TransitionAnimator.TRANSITION_DURATION} linear`;
      text.style.opacity = 1;
      await transitionEndPromise(text);
      text.style.transition = '';
      text.style.opacity = '';
    }.bind(this);
  }
}

function transitionEndPromise(element) {
  return new Promise(resolve => {
    element.addEventListener('transitionend', function f(ev) {
      if(ev.target !== element) return;
      element.removeEventListener('transitionend', f);
      resolve();
    });
  });
}

function requestAnimationFramePromise() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}


const instance = new TransitionAnimator();
export {instance as default, TransitionAnimator};

