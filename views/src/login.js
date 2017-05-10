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



var loginProcess = new Promise((resolve, reject) => {
	$(document).ready(function () {
		resolve()
	})
})
var loginProcess1 = loginProcess.then(()=> {
	return new Promise((resolve, reject) => {
		$('#login').click(function () {
			resolve()
		})
	})
})

var loginProcess2 = loginProcess1.then(() => {
	return new Promise ((resolve, reject) => {
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
									resolve()
							} else {
									failLogin()
									reject()
							}
						})
					})
				} else {
					reject()
				}
			})
	})
})

var loginProcess3 = loginProcess2.then(() => {
	console.log('It should be OK!')
	return new Promise((resolve, reject) => {
		$('#logout').click(function(){
			$.get('tester/logout', (data, status) => {
				console.log(data + " : " + status)
				$('#login').show()
				$('#loginForm').show()
				$('#codemirror').hide()
			})
		})
	})
}).catch(() => {
	console.log('Err')
})

loginProcess3.then()

// $(document).ready(function () {
// 	$('#logout').click(function(){
//
// 	})
// })
