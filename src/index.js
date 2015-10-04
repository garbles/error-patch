const ERROR_TYPES = [
  `Error`,
  `EvalError`,
  `RangeError`,
  `ReferenceError`,
  `SyntaxError`,
  `TypeError`,
  `URIError`
]

const CALLBACK_KEY = `__PATCH_CALLBACK_FN__`
const PARENT_KEY = `__PATCH_PARENT_CONSTRUCTOR__`
const REVERT_KEY = `__PATCH_REVERT_FN__`

function revert () {
  global[this.name] = this[PARENT_KEY]
}

function evalErrorClass (type, callback) {
  eval.call(null, `
    var constructor = ${type};
    var prototype = constructor.prototype;

    var Patched = (function () {
      function ${type} (message, fileName, lineNumber) {
        this.message = message;
        this.fileName = fileName;
        this.stack = (new constructor(message, fileName, lineNumber)).stack;
        Patched.${CALLBACK_KEY}(this);
      }

      ${type}.prototype = prototype;
      ${type}.prototype.constructor = ${type};
      ${type}.${PARENT_KEY} = constructor;

      return ${type};
    }());
  `)

  Patched[REVERT_KEY] = revert
  Patched[CALLBACK_KEY] = callback

  return Patched
}

module.exports = function errorPatch (callback, _types) {
  const types = _types || ERROR_TYPES
  const len = types.length
  let i = -1

  while (++i < len) {
    const type = types[i]
    const constructor = eval(type)

    if (constructor[REVERT_KEY]) {
      constructor[REVERT_KEY]()
    }

    global[type] = evalErrorClass(type, callback)
  }

  return true
}
