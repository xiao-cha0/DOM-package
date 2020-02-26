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
})({"dom.js":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//封装全局dom
window.dom = {
  create: function create(string) {
    //标签名以字符串string形式传入
    //传入一个标签'div'，我给你创建一个div，并命名为container
    var container = document.createElement("template"); //template标签中可以容纳任意标签
    //把传入的标签赋值给创建的div的HTML元素

    container.innerHTML = string.trim(); //trim()这个api可以将创建时的空白文本删除（如：空格、回车等）
    //返回创建的div的第一个儿子

    return container.content.firstChild;
  },
  after: function after(node, node2) {
    //将node2插入到node的后面
    //找到node的爸爸调用爸爸的insertBefore方法，将node2插入到node的下一个兄弟姐妹的前面
    //insertBefore这个api就是在某某节点之前插入
    node.parentNode.insertBefore(node2, node.nextSibling);
  },
  before: function before(node, node2) {
    //将node2插入到node的前面
    node.parentNode.insertBefore(node2, node);
  },
  append: function append(parent, node) {
    //新增一个儿子
    parent.appendChild(node);
  },
  wrap: function wrap(node, parent) {
    //新增一个爸爸
    dom.before(node, parent); //先将它爸爸放在node的前面，使其成为sibling

    dom.append(parent, node); //再将node变成儿子
  },
  remove: function remove(node) {
    //删除节点node
    node.parentNode.removeChild(node);
    return node; //返回删掉的儿子们，方便后面引用
  },
  //删除所有儿子们
  empty: function empty(node) {
    //获取所有儿子们
    // const  {childNodes} = node;//等价于const childNode = node.childNodes,此处使用新语法
    var array = []; //创建一个空数组，用来放删掉的儿子们，方便后面引用

    var x = node.firstChild; //把第一个儿子赋值给x

    while (x) {
      //遍历，如果x存在
      array.push(dom.remove(x)); //把x删掉，并添加到数组array

      x = node.firstChild; //让x指向删掉后新的第一个儿子
    }

    return array; //返回这个数组，方便调用
  },
  //改node中的属性
  //下面使用到的方法就是重载
  attr: function attr(node, name, value) {
    //接受3个参数，分别是：node节点、属性名、属性值
    if (arguments.length === 3) {
      //如果参数的长度等于3
      node.setAttribute(name, value); //改属性
    } else if (arguments.length === 2) {
      //如果参数的长度等于2
      return node.getAttribute(name); //度属性
    }
  },
  //下面使用到的方法就是适配
  text: function text(node, string) {
    //修改文本节点的属性值
    if (arguments.length === 2) {
      //判断其参数的长度，如果等于2就是修改属性值
      if ('innerText' in node) {
        //判断'innerText'这个api是否在node这个节点里面（innerText是IE提供的，担心其他浏览器不支持）
        node.innerText = string; //用innerText修改其属性值
      } else {
        //否则就是没有上面的innerText api
        node.textContent = string; //用textContent修改其属性值
      }
    } else if (arguments.length === 1) {
      //判断其参数的长度，如果等于2就是获取属性值
      if ('innerText' in node) {
        //判断'innerText'这个api是否在node这个节点里面（innerText是IE提供的，担心其他浏览器不支持）
        return node.innerText; //用innerText获取其属性值
      } else {
        //否则就是没有上面的innerText api
        return node.textContent; //用textContent获取其属性值
      }
    }
  },
  //改html元素
  html: function html(node, string) {
    if (arguments.length === 2) {
      //断其参数的长度，如果等于2就是修改元素值
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      //断其参数的长度，如果等于1就是获取属性值
      return node.innerHTML;
    }
  },
  //改，读，写元素的style属性
  style: function style(node, name, value) {
    //接受3个参数：node、属性名、属性值
    if (arguments.length === 3) {
      //判断：如果参数长度等于3
      //dom.style(div,color 'red')
      node.style[name] = value;
    } else if (arguments.length === 2) {
      //判断：如果参数长度等于2
      //dom.style(div,color)
      return node.style[name];
    } else if (_typeof(name) in object) {
      //判断：如果参数name的类型是对象，说明对象内包含多个属性
      //dom.style(object)
      for (var key in name) {
        //遍历name参数
        dom.style[key] = name[key]; //让参数name中属性就等于节点node.style的属性
      }
    }
  },
  //添加、删除、判断
  class: {
    //添加className
    add: function add(node, className) {
      node.classList.add(className);
    },
    //删除className
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    //判断是否有className
    contains: function contains(node, className) {
      return node.classList.contains(className);
    }
  },
  //添加事件监听
  on: function on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  //移除事件监听
  off: function off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  //查找元素
  find: function find(selector, scope) {
    //selector是选择器,scope是代表查找范围
    //如果scope存在，就先到scope中去找，否则就在document中去找
    return (scope || document).querySelectorAll(selector);
  },
  //找爸爸
  parent: function parent(node) {
    return node.parentNode;
  },
  //找孩子们
  children: function children(node) {
    return node.children;
  },
  //查兄弟姐妹
  siblings: function siblings(node) {
    //先找到所有孩子们,并把它通过Array.from变成真正的数组
    // 通过filter筛选出自己（也就是node）
    Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    });
  },
  //找弟弟
  next: function next(node) {
    var x = node.nextSibling; //让x代替这个弟弟

    while (x && x.nodeType === 3) {
      //判断：如果弟弟是存在的，且它的类型是文本
      x = x.nextSibling; //就让x再次指向下一个弟弟，继续循环，直到不是文本就停止
    }

    return x; //判断：如果所有弟弟中都是文本就表示没有找到其他元素，那就直接返回x
  },
  //找哥哥
  previous: function previous(node) {
    var x = node.previous; //让x代替这个哥哥

    while (x && x.nodeType === 3) {
      //判断：如果哥哥是存在的，且它的类型是文本
      x = x.previous; //就让x再次指向上一个哥哥，继续循环，直到不是文本就停止
    }

    return x; //判断：如果所有哥哥中都是文本就表示没有找到其他元素，那就直接返回x
  },
  //遍历所有节点node
  each: function each(nodeList, fn) {
    //接受两个参数：nodeList（所有节点的列表）、fn
    for (var i = 0; i < nodeList.length; i++) {
      //遍历节点列表
      fn.call(null, nodeList[i]); //对遍历到的每一项我去调用fn
    }
  },
  //找节点node在兄弟中排行老几
  index: function index(node) {
    //获取到所有儿子们
    var list = dom.children(node.parentNode); //遍历所有儿子们

    var i;

    for (i = 0; i < list.length; i++) {
      //如果儿子们中第i个刚好 === node
      if (list[i] === node) {
        break; //停止遍历
      }
    }

    return i; //返回它的下标
  }
};
},{}],"C:/Users/Administrator.USER-20160425SJ/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49619" + '/');

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
},{}]},{},["C:/Users/Administrator.USER-20160425SJ/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.1d0b6d56.js.map