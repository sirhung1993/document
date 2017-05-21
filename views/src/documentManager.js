'use strict'

function addNewDocument() {
  return new Promise((resolve, reject) => {
    var documentName = $("#documentNameInput").val()

    if(documentName) {
      $(".warningBox").hide("fast", () => {
        $("#addNewWarning").show("fast", () => {
          $("h3").remove(".warning")
          var warningStatement = 'Do you actually want to add <span class="w3-text-red w3-xlarge">' + documentName + '</span> file in to RBT Document?'
          $("#addNewWarning").prepend("<h3 class=\"warning\">" + warningStatement + "</h3>")
          setTimeout(() => {
          $(".warningBox").hide("fast", () => {
          })
        },10000)
        })
      })

      resolve(documentName)
    } else {
      $("#inputMissing").show("fast", () => {
        setTimeout(() => {
          $(".warningBox").hide("fast", () => {
            resolve()
          })
        }, 5000)
      })
    }
  })
}

function cancelWarning() {
  return new Promise((resolve, reject) => {
      $(".warningBox").hide("fast", () => {
        resolve()
      })
  })
}

function displaySuccess(content) {
  return new Promise((resolve, reject) => {
    $("#suscessNoticement").empty()
    var suscessContent = '<h3 class="w3-xlarge warning">' + content + "</h3>"
    $("#suscessNoticement").prepend(suscessContent)
    $("#suscessNoticement").show("fast", ()=> {
      setTimeout(() => {
        $("#suscessNoticement").hide("fast", ()=> {
            resolve(content)
        })
      }, 5000)
    })
  })
}

function displayError(err) {
  return new Promise((resolve, reject) => {
    $("#errorWarning").empty()
    var errorContent = '<h3 class="w3-xlarge warning">' + err + "</h3>"
    $("#errorWarning").prepend(errorContent)
    $("#errorWarning").show("fast", () => {
      setTimeout(() => {
        $("#errorWarning").hide("fast", () => {
          resolve(err)
        })
      }, 10000)
    })
  })
}

function showCodeEditor() {
  return new Promise((resolve, reject) => {
    $("#editor").show("fast", () => {
      resolve()
    })
  })
}

function confirmAddNew() {
  return new Promise((resolve, reject) => {
      addNewDocument().then((documentName) => {
        $.post("tester/document/addnew", {
          documentName: documentName
        }, (data, status) => {
          console.log(status)
          if (data.OK) {
            console.log(data.OK.msg)
            displaySuccess(data.OK.msg).then(() => {
                resolve()
            })
          } else {
            var err = data.err.msg
            console.log(err)
            displayError(err).then(() => {
              reject(err)
            })
          }
        })
      })
  })
}

function modifyADocument() {
  return new Promise((resolve, reject) => {
    var documentName = $("#documentNameInput").val()

    if(documentName) {
      $(".warningBox").hide("fast", () => {
        $("#modifyWarning").show("fast", () => {
          $("h3").remove(".warning")
          var warningStatement = 'Do you actually want to modify the <span class="w3-text-red w3-xlarge">' + documentName + '</span> file in to RBT Document?'
          $("#modifyWarning").prepend("<h3 class=\"warning\">" + warningStatement + "</h3>")
          setTimeout(() => {
          $(".warningBox").hide("fast", () => {
          }).stop()
        },10000)
        })
      })

      resolve(documentName)
    } else {
      $("#inputMissing").show("fast", () => {
        setTimeout(() => {
          $(".warningBox").hide("fast", () => {
            resolve()
          })
        }, 5000)
      })
    }
  })
}

function confirmModify() {
  return new Promise((resolve, reject) => {
      modifyADocument().then((documentName) => {
        $.post("tester/document/addnew", {
          documentName: documentName
        }, (data, status) => {
          console.log(status)
          if (data.OK) {
            console.log(data.OK.msg)
            displaySuccess(data.OK.msg).then(() => {
                resolve()
            })
          } else {
            var err = data.err.msg
            console.log(err)
            displayError(err).then(() => {
              reject(err)
            })
          }
        })
      })
  })
}
