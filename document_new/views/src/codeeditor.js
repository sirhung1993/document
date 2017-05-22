'use strict'
// setTimeout(() => {
//   var edittor = CodeMirror(document.getElementById("codeeditor"), {
//     mode:  "markdown",
//     theme: "monokai",
//     lineNumbers: true,
//   })
// }, 1000 )

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: 'markdown',
  value: "",
  mime: 'text/x-markdown',
  lineNumbers: true,
  theme: "monokai"
});

function loadLatestDocumentOfATester() {
  return new Promise((resolve, reject) => {
    var documentName = $("#documentNameInput").val()
    var url = '//tester//getLatestVersionOfCurrentUser//' + documentName
    $.get(url, (data, status) => {
      if (data.OK) {
        var content = data.OK.msg
        editor.setValue(content)
        resolve(content)
      } else {
        var err = data.err.msg
        displayError(err)
        reject(err)
      }
    })
  })
}

function saveDocument() {
  return new Promise((resolve, reject) => {
    $("#saveDocumentWarning").show("fast", () => {
      var documentName = $("#documentNameInput").val()
      $("h3").remove(".warning")
      var warningStatement = 'Do you actually want to save <span class="w3-text-blue w3-xlarge">' + documentName + '</span> file?'
      $("#saveDocumentWarning").prepend("<h3 class=\"warning\">" + warningStatement + "</h3>")
      setTimeout(() => {
      $(".warningBox").hide("fast", () => {
      })
    },10000)
    })
    resolve(documentName)
  })
}

function saveAndSubmitDocument() {
  return new Promise((resolve, reject) => {
    $("#saveAndSubmitDocumentWarning").show("fast", () => {
      var documentName = $("#documentNameInput").val()
      $("h3").remove(".warning")
      var warningStatement = 'Do you actually want to save and submit <span class="w3-text-blue w3-xlarge">' + documentName + '</span> file to RBT Document? This will immediately update document.'
      $("#saveAndSubmitDocumentWarning").prepend("<h3 class=\"warning\">" + warningStatement + "</h3>")
      setTimeout(() => {
      $(".warningBox").hide("fast", () => {
      })
    },10000)
    })
    resolve(documentName)
  })
}

function saveDocumentConfirm() {
  return new Promise((resolve, reject) => {
    var text = editor.getValue()
    var documentName = $("#documentNameInput").val()
    $.post("tester/document/save",
    {
      documentName: documentName,
      documentContent: text
    }, (data, status) => {
      if(data.OK) {
        displaySuccess(data.OK.msg)
        resolve()
      } else {
        displayError(data.err.msg)
        reject()
      }
    })
  })
}

function saveDocumentAndSubmitConfirm() {
  return new Promise((resolve, reject) => {
    var text = editor.getValue()
    var documentName = $("#documentNameInput").val()
    $.post("tester/document/saveAndSubmit",
    {
      documentName: documentName,
      documentContent: text
    }, (data, status) => {
      if(data.OK) {
        displaySuccess(data.OK.msg)
        resolve()
      } else {
        displayError(data.err.msg)
        reject()
      }
    })
  })
}
