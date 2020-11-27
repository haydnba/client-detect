// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../.npm/global/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/detect-browser/es/index.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detect = detect;
exports.browserName = browserName;
exports.parseUserAgent = parseUserAgent;
exports.detectOS = detectOS;
exports.getNodeVersion = getNodeVersion;
exports.ReactNativeInfo = exports.BotInfo = exports.SearchBotDeviceInfo = exports.NodeInfo = exports.BrowserInfo = void 0;

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

var BrowserInfo =
/** @class */
function () {
  function BrowserInfo(name, version, os) {
    this.name = name;
    this.version = version;
    this.os = os;
    this.type = 'browser';
  }

  return BrowserInfo;
}();

exports.BrowserInfo = BrowserInfo;

var NodeInfo =
/** @class */
function () {
  function NodeInfo(version) {
    this.version = version;
    this.type = 'node';
    this.name = 'node';
    this.os = process.platform;
  }

  return NodeInfo;
}();

exports.NodeInfo = NodeInfo;

var SearchBotDeviceInfo =
/** @class */
function () {
  function SearchBotDeviceInfo(name, version, os, bot) {
    this.name = name;
    this.version = version;
    this.os = os;
    this.bot = bot;
    this.type = 'bot-device';
  }

  return SearchBotDeviceInfo;
}();

exports.SearchBotDeviceInfo = SearchBotDeviceInfo;

var BotInfo =
/** @class */
function () {
  function BotInfo() {
    this.type = 'bot';
    this.bot = true; // NOTE: deprecated test name instead

    this.name = 'bot';
    this.version = null;
    this.os = null;
  }

  return BotInfo;
}();

exports.BotInfo = BotInfo;

var ReactNativeInfo =
/** @class */
function () {
  function ReactNativeInfo() {
    this.type = 'react-native';
    this.name = 'react-native';
    this.version = null;
    this.os = null;
  }

  return ReactNativeInfo;
}();

exports.ReactNativeInfo = ReactNativeInfo;
// tslint:disable-next-line:max-line-length
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [['aol', /AOLShield\/([0-9\._]+)/], ['edge', /Edge\/([0-9\._]+)/], ['edge-ios', /EdgiOS\/([0-9\._]+)/], ['yandexbrowser', /YaBrowser\/([0-9\._]+)/], ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/], ['samsung', /SamsungBrowser\/([0-9\.]+)/], ['silk', /\bSilk\/([0-9._-]+)\b/], ['miui', /MiuiBrowser\/([0-9\.]+)$/], ['beaker', /BeakerBrowser\/([0-9\.]+)/], ['edge-chromium', /EdgA?\/([0-9\.]+)/], ['chromium-webview', /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/], ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/], ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/], ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/], ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/], ['fxios', /FxiOS\/([0-9\.]+)/], ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/], ['opera', /Opera\/([0-9\.]+)(?:\s|$)/], ['opera', /OPR\/([0-9\.]+)(:?\s|$)/], ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/], ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/], ['ie', /MSIE\s(7\.0)/], ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/], ['android', /Android\s([0-9\.]+)/], ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/], ['safari', /Version\/([0-9\._]+).*Safari/], ['facebook', /FBAV\/([0-9\.]+)/], ['instagram', /Instagram\s([0-9\.]+)/], ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/], ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/], ['searchbot', SEARCHBOX_UA_REGEX]];
var operatingSystemRules = [['iOS', /iP(hone|od|ad)/], ['Android OS', /Android/], ['BlackBerry OS', /BlackBerry|BB10/], ['Windows Mobile', /IEMobile/], ['Amazon OS', /Kindle/], ['Windows 3.11', /Win16/], ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/], ['Windows 98', /(Windows 98)|(Win98)/], ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/], ['Windows XP', /(Windows NT 5.1)|(Windows XP)/], ['Windows Server 2003', /(Windows NT 5.2)/], ['Windows Vista', /(Windows NT 6.0)/], ['Windows 7', /(Windows NT 6.1)/], ['Windows 8', /(Windows NT 6.2)/], ['Windows 8.1', /(Windows NT 6.3)/], ['Windows 10', /(Windows NT 10.0)/], ['Windows ME', /Windows ME/], ['Open BSD', /OpenBSD/], ['Sun OS', /SunOS/], ['Chrome OS', /CrOS/], ['Linux', /(Linux)|(X11)/], ['Mac OS', /(Mac_PowerPC)|(Macintosh)/], ['QNX', /QNX/], ['BeOS', /BeOS/], ['OS/2', /OS\/2/]];

function detect(userAgent) {
  if (!!userAgent) {
    return parseUserAgent(userAgent);
  }

  if (typeof document === 'undefined' && typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return new ReactNativeInfo();
  }

  if (typeof navigator !== 'undefined') {
    return parseUserAgent(navigator.userAgent);
  }

  return getNodeVersion();
}

function matchUserAgent(ua) {
  // opted for using reduce here rather than Array#first with a regex.test call
  // this is primarily because using the reduce we only perform the regex
  // execution once rather than once for the test and for the exec again below
  // probably something that needs to be benchmarked though
  return ua !== '' && userAgentRules.reduce(function (matched, _a) {
    var browser = _a[0],
        regex = _a[1];

    if (matched) {
      return matched;
    }

    var uaMatch = regex.exec(ua);
    return !!uaMatch && [browser, uaMatch];
  }, false);
}

function browserName(ua) {
  var data = matchUserAgent(ua);
  return data ? data[0] : null;
}

function parseUserAgent(ua) {
  var matchedRule = matchUserAgent(ua);

  if (!matchedRule) {
    return null;
  }

  var name = matchedRule[0],
      match = matchedRule[1];

  if (name === 'searchbot') {
    return new BotInfo();
  }

  var versionParts = match[1] && match[1].split(/[._]/).slice(0, 3);

  if (versionParts) {
    if (versionParts.length < REQUIRED_VERSION_PARTS) {
      versionParts = __spreadArrays(versionParts, createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length));
    }
  } else {
    versionParts = [];
  }

  var version = versionParts.join('.');
  var os = detectOS(ua);
  var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);

  if (searchBotMatch && searchBotMatch[1]) {
    return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
  }

  return new BrowserInfo(name, version, os);
}

function detectOS(ua) {
  for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
    var _a = operatingSystemRules[ii],
        os = _a[0],
        regex = _a[1];
    var match = regex.exec(ua);

    if (match) {
      return os;
    }
  }

  return null;
}

function getNodeVersion() {
  var isNode = typeof process !== 'undefined' && process.version;
  return isNode ? new NodeInfo(process.version.slice(1)) : null;
}

function createVersionParts(count) {
  var output = [];

  for (var ii = 0; ii < count; ii++) {
    output.push('0');
  }

  return output;
}
},{"process":"../../../.npm/global/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"index.js":[function(require,module,exports) {
var _require = require('detect-browser'),
    detect = _require.detect;

var browser = detect(); // handle the case where we don't detect the browser

if (browser) {
  console.log(browser.name);
  console.log(browser.version);
  console.log(browser.os);
}
},{"detect-browser":"node_modules/detect-browser/es/index.js"}],"../../../.npm/global/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57762" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.npm/global/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/detect-client.e31bb0bc.js.map