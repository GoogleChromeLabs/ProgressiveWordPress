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

import {HeaderAnimator} from './header-animator.js'

let btn, pending, respond, comments;

async function updateBindings() {
  btn = document.querySelector('.commentformexpand');
  pending = document.querySelector('#pendingcomments');
  comments = document.querySelector('.comments');
  respond = document.querySelector('#respond');
  btn.addEventListener('click', onClick);
}

async function onClick() {
  const btnRect = btn.getBoundingClientRect();
  const rectCollapsed = comments.getBoundingClientRect();
  respond.style.display = 'block';
  btn.style.display = 'none;'
  const rectExpanded = comments.getBoundingClientRect();
  btn.style.display = 'block';
  respond.style.opacity = '0';
  const offset = rectCollapsed.top - rectExpanded.top;
  pending.style.transform = comments.style.transform = `translateY(${offset}px)`;
  btn.style.position = 'relative';
  await requestAnimationFramePromise();
  await requestAnimationFramePromise();
  pending.style.transition = comments.style.transition = `transform ${HeaderAnimator.TRANSITION_DURATION} ${HeaderAnimator.TRANSITION_F}`;
  btn.style.transition = `opacity ${HeaderAnimator.TRANSITION_DURATION} ${HeaderAnimator.TRANSITION_F}`;
  pending.style.transform = comments.style.transform = `translateY(${-btnRect.height}px)`;
  btn.style.opacity = '0';
  await transitionEndPromise(pending);
  btn.style.display = 'none';
  pending.style.transition = comments.style.transition = pending.style.transform = comments.style.transform = '';
  respond.style.transition = `opacity ${HeaderAnimator.TRANSITION_DURATION} ${HeaderAnimator.TRANSITION_F}`;
  respond.style.opacity = '1';
  await transitionEndPromise(respond);
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

updateBindings().catch(_ => {});
_pubsubhub.subscribe('navigation', _ => updateBindings().catch(_ => {}));
