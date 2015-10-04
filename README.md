# :warning: ERROR PATCH!

Patch all error classes so that you can run them through a callback before throwing.

### Usage

```js
const errorPatch = require(`error-patch`)

errorPatch(error => {
  // handle the error object
  someLoggerFunction(error)
})

throw new Error('ERRRRORRRRR!!!')
```

### !!

This is a fun experiment and you should probably just use `window.onerror`.
