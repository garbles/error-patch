const test = require(`tape`)
const errorPatch = require(`../src`)

test(`Patching of Error class`, t => {
  t.plan(2)

  const message = `ERROR!!`

  errorPatch(error => {
    t.equal(error.constructor.name, `Error`, `Error is patched`)
    t.equal(error.message, message, `Error message is still assigned`)
  }, [`Error`])

  new Error(message)
  new SyntaxError(message) // does not call the expectations again
})
