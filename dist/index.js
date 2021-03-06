(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.errorPatch = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var ERROR_TYPES = ["Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"];

var CALLBACK_KEY = "__PATCH_CALLBACK_FN__";
var PARENT_KEY = "__PATCH_PARENT_CONSTRUCTOR__";
var REVERT_KEY = "__PATCH_REVERT_FN__";

function revert() {
  global[this.name] = this[PARENT_KEY];
}

function evalErrorClass(type, callback) {
  eval.call(null, "\n    var constructor = " + type + ";\n    var prototype = constructor.prototype;\n\n    var Patched = (function () {\n      function " + type + " (message, fileName, lineNumber) {\n        this.message = message;\n        this.fileName = fileName;\n        this.stack = (new constructor(message, fileName, lineNumber)).stack;\n        Patched." + CALLBACK_KEY + "(this);\n      }\n\n      " + type + ".prototype = prototype;\n      " + type + ".prototype.constructor = " + type + ";\n      " + type + "." + PARENT_KEY + " = constructor;\n\n      return " + type + ";\n    }());\n  ");

  Patched[REVERT_KEY] = revert;
  Patched[CALLBACK_KEY] = callback;

  return Patched;
}

module.exports = function errorPatch(callback, _types) {
  var types = _types || ERROR_TYPES;
  var len = types.length;
  var i = -1;

  while (++i < len) {
    var type = types[i];
    var _constructor = eval(type);

    if (_constructor[REVERT_KEY]) {
      _constructor[REVERT_KEY]();
    }

    global[type] = evalErrorClass(type, callback);
  }

  return true;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});