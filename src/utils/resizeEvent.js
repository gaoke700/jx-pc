/* Modified from https://github.com/sdecima/javascript-detect-element-resize
 * version: 0.5.3
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Sebastián Décima
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
/* eslint-disable no-param-reassign */
const isServer = typeof window === 'undefined';

function noop() {}

const requestFrame = (function requestFrame() {
  if (isServer) return noop;
  const raf = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || function rt(fn) {
      return window.setTimeout(fn, 20);
    };

  return function cb(fn) {
    return raf(fn);
  };
}());

const cancelFrame = (function cancelFrame() {
  if (isServer) return noop;
  const cancel = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.clearTimeout;

  return function rt(id) {
    return cancel(id);
  };
}());

const resetTrigger = function resetTrigger(element) {
  const trigger = element.resizeTrigger;
  const expand = trigger.firstElementChild;
  const contract = trigger.lastElementChild;
  const expandChild = expand.firstElementChild;

  contract.scrollLeft = contract.scrollWidth;
  contract.scrollTop = contract.scrollHeight;
  expandChild.style.width = `${expand.offsetWidth + 1}px`;
  expandChild.style.height = `${expand.offsetHeight + 1}px`;
  expand.scrollLeft = expand.scrollWidth;
  expand.scrollTop = expand.scrollHeight;
};

const checkTriggers = function checkTriggers(element) {
  return element.offsetWidth !== element.resizeLast.width
    || element.offsetHeight !== element.resizeLast.height;
};

const scrollListener = function scrollListener(event) {
  resetTrigger(this);
  if (this.resizeRAF) cancelFrame(this.resizeRAF);
  this.resizeRAF = requestFrame(() => {
    if (checkTriggers(this)) {
      this.resizeLast.width = this.offsetWidth;
      this.resizeLast.height = this.offsetHeight;
      this.resizeListeners.forEach((fn) => {
        fn.call(this, event);
      });
    }
  });
};

/* Detect CSS Animations support to detect element display/re-attach */
const attachEvent = isServer ? {} : document.attachEvent;
const DOM_PREFIXES = 'Webkit Moz O ms'.split(' ');
const START_EVENTS = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' ');
const RESIZE_ANIMATION_NAME = 'resizeanim';
let animation = false;
let keyFramePrefix = '';
let animationStartEvent = 'animationstart';

if (!attachEvent && !isServer) {
  const testElement = document.createElement('fakeelement');
  if (testElement.style.animationName !== undefined) {
    animation = true;
  }

  if (animation === false) {
    let prefix = '';
    for (let i = 0; i < DOM_PREFIXES.length; i += 1) {
      if (testElement.style[`${DOM_PREFIXES[i]}AnimationName`] !== undefined) {
        prefix = DOM_PREFIXES[i];
        keyFramePrefix = `-${prefix.toLowerCase()}-`;
        animationStartEvent = START_EVENTS[i];
        animation = true;
        break;
      }
    }
  }
}

let stylesCreated = false;
const createStyles = function createStyles() {
  if (!stylesCreated && !isServer) {
    const animationKeyframes = `@${keyFramePrefix}keyframes ${RESIZE_ANIMATION_NAME} { from { opacity: 0; } to { opacity: 0; } } `;
    const animationStyle = `${keyFramePrefix}animation: 1ms ${RESIZE_ANIMATION_NAME};`;

    // opacity: 0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
    const css = `${animationKeyframes}
      .resize-triggers { ${animationStyle} visibility: hidden; opacity: 0; }
      .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1 }
      .resize-triggers > div { background: #eee; overflow: auto; }
      .contract-trigger:before { width: 200%; height: 200%; }`;

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    stylesCreated = true;
  }
};

export const addResizeListener = function addResizeListener(element, fn) {
  if (isServer) return;
  if (attachEvent) {
    element.attachEvent('onresize', fn);
  } else {
    if (!element.resizeTrigger) {
      if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
      }
      createStyles();
      element.resizeLast = {};
      element.resizeListeners = [];

      const resizeTrigger = document.createElement('div');
      element.resizeTrigger = resizeTrigger;
      resizeTrigger.className = 'resize-triggers';
      resizeTrigger.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
      element.appendChild(resizeTrigger);

      resetTrigger(element);
      element.addEventListener('scroll', scrollListener, true);

      /* Listen for a css animation to detect element display/re-attach */
      if (animationStartEvent) {
        resizeTrigger.addEventListener(animationStartEvent, (event) => {
          if (event.animationName === RESIZE_ANIMATION_NAME) {
            resetTrigger(element);
          }
        });
      }
    }
    element.resizeListeners.push(fn);
  }
};

export const removeResizeListener = function removeResizeListener(element, fn) {
  if (attachEvent) {
    element.detachEvent('onresize', fn);
  } else {
    element.resizeListeners.splice(element.resizeListeners.indexOf(fn), 1);
    if (!element.resizeListeners.length) {
      element.removeEventListener('scroll', scrollListener);
      element.resizeTrigger = !element.removeChild(element.resizeTrigger);
    }
  }
};

