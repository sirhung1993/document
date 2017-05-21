'use strict'
setTimeout(() => {
  var edittor = CodeMirror(document.getElementById("codeeditor"), {
    value: "    ",
    mode:  "javascript",
    theme: "monokai",
    lineNumbers: true,
    autoRefresh: true,
    autofocus: true
  })
}, 1000 )
