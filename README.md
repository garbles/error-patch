# :warning: ERROR PATCH!

Patch all error classes so that you can run them through a callback before throwing.

### Usage

```js
const errorPatch = require(`error-patch`)

errorPatch(error => {
  // handle the error object
  someLoggerFunction(error)
})
```
