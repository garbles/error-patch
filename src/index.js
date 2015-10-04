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
