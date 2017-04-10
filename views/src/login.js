'use trict'
function successLogin(cb) {
	$('#logout').show()
	$('#login').hide()
	$('#loginForm').hide()
	cb
}

const invalidPasswordOrUsername = '<p class="w3-text-red">Invalid password or username</p>'

function failLogin(cb) {
	$("label").empty()
	$("#testerID").append(invalidPasswordOrUsername)
	$("#password").append(invalidPasswordOrUsername)
	cb
}


var mode = 'javascript'
var theme = 'monokai'
var lineNumbers = true
var tabSize = 5
var autoCompleteHotkey = 	'Ctrl-Space'

var codeEditorParameter = '<script>' +
'var editor = CodeMirror(document.getElementById("codeeditor"),'+
'{mode: '+ '"' + mode + '"' + ',' +
'theme: '+ '"' + theme + '"' + ',' +
'tabSize: '+ tabSize + ',' +
'lineNumbers: ' + lineNumbers + ',' +
'extraKeys: {"Ctrl-Space" : "autocomplete"}' +
'}' +
 ')' +
'</script>'

function loadCodeMirror(cb) {
	$("footer").before('<div id="codemirror" class="w3-row"></div>')
	$('#codemirror').load('/views/iframe/codemirror_iframe.ejs', null,
	function(responseTxt, statusTxt, xhr){
		if(statusTxt === 'success'){
				$("footer").append(codeEditorParameter)
		} else {

		}
	})
	cb
}

$(document).ready(function () {
    $('#login').click(function () {
    $('#loginForm').load('views/iframe/login_iframe.ejs', null, function (responseTxt, statusTxt, xhr) {
        if(statusTxt === 'success') {
          $('#loginButton').click(function () {
						var testerID = $("[name ='testerID']").val()
						var password = $("[name ='password']").val()
						$.post('/tester/login',
						{
							testerID : testerID,
							password : password
						},function(data, status){
							if (data.OK) {
								successLogin(loadCodeMirror())
							} else {
								failLogin()
							}
						})
          })
        } else {

        }
      })
    })
  })

$(document).ready(function () {
	$('#logout').click(function(){

	})
})
