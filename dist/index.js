(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.errorPatch = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
const ERROR_TYPES = [
  `Error`,
  `EvalError`,
  `RangeError`,
  `ReferenceError`,
  `SyntaxError`,
  `TypeError`,
  `URIError`
]

function evalErrorClass (type, callback) {
  eval.call(null, `
    var constructor = ${type};
    var prototype = constructor.prototype;

    var Patched = (function () {
      function ${type} (message, fileName, lineNumber) {
        this.message = message;
        this.fileName = fileName;
        this.stack = (new constructor(message, fileName, lineNumber)).stack;
        Patched.__callback__(this);
      }

      ${type}.prototype = prototype;
      ${type}.prototype.constructor = ${type};

      return ${type};
    }());
  `)

  Patched.__callback__ = callback;

  return Patched
}

module.exports = function errorPatch (callback, _types) {
  const types = _types || ERROR_TYPES
  const len = types.length
  let i = -1

  while (++i < len) {
    const type = types[i]
    global[type] = evalErrorClass(type, callback)
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});