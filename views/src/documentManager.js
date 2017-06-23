'use strict'

function addNewDocument() {
  return new Promise(function ( resolve, reject )  {
    var documentName = $("#documentNameInput").val()

    if(documentName) {
      $(".warningBox").hide("fast", function (  )  {
        $("#addNewWarning").show("fast", function (  )  {
          $("h3").remove(".warning")
          var warningStatement = 'Do you actually want to add <span class="w3-text-blue w3-xlarge">' + documentName + '</span> file in to RBT Document?'
          $("#addNewWarning").prepend("<h3 class=\"warning\" >" + warningStatement + "</h3>" + "<div class=\"w3-center\"><input type=\"button\" class=\"w3-btn w3-light-blue w3-hover-blue\" value=\"  OK  \" onclick=\"$('#addNewWarning').hide()\" ></input>\<p></p>" )
          setTimeout(function (  )  {
          $(".warningBox").hide("fast", function (  )  {
          })
        },10000)
        })
      })
      resolve(documentName)
    } else {
      $("#inputMissing").show("fast", function (  )  {
        setTimeout(function (  )  {
          $(".warningBox").hide("fast", function (  )  {
            resolve()
          })
        }, 5000)
      })
    }
  })
}

function cancelWarning() {
  return new Promise(function ( resolve, reject )  {
      $(".warningBox").hide("fast", function (  )  {
        resolve()
      })
  })
}

function displaySuccess(content) {
  return new Promise(function ( resolve, reject )  {
    cancelWarning().then(function (  )  {
      $("#suscessNoticement").empty()
      var suscessContent = '<h3 class="w3-xlarge warning">' + content + "</h3>" + "<div class=\"w3-center\"><input type=\"button\" class=\"w3-btn w3-light-blue w3-hover-blue\" value=\"  OK  \" onclick=\"$('#suscessNoticement').hide()\" ></input>\<p></p>" 
      $("#suscessNoticement").prepend(suscessContent)
      $("#suscessNoticement").show("fast", function (  )  {
        setTimeout(function (  )  {
          $("#suscessNoticement").hide("fast", function (  )  {
              resolve(content)
          })
        }, 5000)
      })
    })
    })
}

function displayError(err) {
  return new Promise(function ( resolve, reject )  {
    cancelWarning().then(function (  )  {
      $("#errorWarning").empty()
      var errorContent = '<h3 class="w3-xlarge warning">' + err + "</h3>"
      $("#errorWarning").prepend(errorContent)
      $("#errorWarning").show("fast", function (  )  {
        setTimeout(function (  )  {
          $("#errorWarning").hide("fast", function (  )  {
            resolve(err)
          })
        }, 10000)
      })
    })
    })
}

function showCodeEditor() {
  return new Promise(function ( resolve, reject )  {
    $("#editor").show("fast", function (  )  {
      resolve()
    })
  })
}

function confirmAddNew() {
  return new Promise(function ( resolve, reject )  {
      addNewDocument().then(function ( documentName )  {
        $.post("tester/document/addnew", {
          documentName: documentName
        }, function ( data, status )  {
          console.log(status)
          if (data.OK) {
            console.log(data.OK.msg)
            displaySuccess(data.OK.msg).then(function (  )  {
                resolve()
            })
          } else {
            var err = data.err.msg
            console.log(err)
            displayError(err).then(function (  )  {
              reject(err)
            })
          }
        })
      })
  })
}

function modifyADocument() {
    alert("OK")
  return new Promise(function ( resolve, reject )  {
    var documentName = $("#documentNameInput").val()

    if(documentName) {
    loadLatestDocumentOfATester().then(function (  )  {

    })



      resolve(documentName)
    } else {
     $("#inputMissing").show("fast", function (  )  {
        setTimeout(function (  )  {
            $(".warningBox").hide("fast", function (  )  {
                resolve()
            })
        }, 5000)
      })
    }
  })
}

function confirmModify() {
  return new Promise(function ( resolve, reject )  {
      modifyADocument().then(function ( documentName )  {
        $.post("tester/document/addnew", {
          documentName: documentName
        }, function ( data, status )  {
          console.log(status)
          if (data.OK) {
            console.log(data.OK.msg)
            displaySuccess(data.OK.msg).then(function (  )  {
                resolve()
            })
          } else {
            var err = data.err.msg
            console.log(err)
            displayError(err).then(function (  )  {
              reject(err)
            })
          }
        })
      })
  })
}


function selectedDocument(selectRow) {
	return new Promise(function ( resolve, reject )  {
		var value = selectRow.childNodes[0].childNodes[0].innerHTML
		$("#documentNameInput").val(value);        
        $("#btnAdd").hide(200, function(){
            $("#documentNameInput").animate({width: '100%'}, 200)
        })
        loadLatestDocumentOfATester()
		resolve()
	});
}

function addNewHideModify()
{
    if(CheckKeyWordExit() === false){
        $("#documentNameInput").animate({width: '79%'}, 200, function(){
            $("#btnAdd").show("200")
        })
    }
    else{
        $("#btnAdd").hide(200, function(){
            $("#documentNameInput").animate({width: '100%'}, 200)
        })
    }
    return 1;
}

function CheckKeyWordExit()
{
    var input, filter, table, tr, td, i, span;
    input = document.getElementById("documentNameInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("documentInfoTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        console.log(tr[i])
        td = tr[i].getElementsByTagName("td")[0]
       
        if (td){
            console.log(td)        
            span = td.getElementsByTagName("span")[0];
        
            if (span.innerHTML.toUpperCase() == filter) 
            {
                return true;
            }
        }
    }
    return false;
}

function ShowHideDocList()
{
    if($("#DocText").attr("style").indexOf('width: 80%') >= 0) {
        $("#DocList").animate({width: '40%'});
        $("#DocText").animate({width: '40%'});
    } 
    else{
        $("#DocList").animate({width: '0px'});
        $("#DocText").animate({width: '80%'});
    }
}