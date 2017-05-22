'use strict'

function loginSuccess() {
	return new Promise((resolve, reject) => {
		$("#login").hide(() => {
			$("#register").hide(() => {
				$("#logout").show(() => {
				})
			})
		})
		resolve()
	})
}

function loadEdittor() {
	return new Promise((resolve, reject) => {
		$("#editor").show(() => {
			resolve()
		})
	})
}

function regRequest() {
	return new Promise((resolve, reject) => {
		var regTesterID = $("[name = regTesterID]").val()
		var regPassword1 = $("[name = regPassword1]").val()
		var regPassword2 = $("[name = regPassword2]").val()
		// console.log(regTesterID + " : " + regPassword1 + " : " + regPassword2)
		if(regTesterID && regPassword1 && regPassword2) {
			if(regPassword1 === regPassword2) {
				$.post('tester/register', {
					testerID: regTesterID,
			    password: regPassword1
				}, (data, status) => {
					if (data.OK) {
						console.log(data.OK.msg)
						displaySuccess('Register suscessfully! Please contact admin to get read/write access! This page will be reload in 5 seconds')
						setTimeout(() => {
							location.reload()
					},5000)
						resolve()
					} else {
						displayError('TesterID has been existed.' +
						'. Please try again with another testerID or contact admin to reset password!')
						reject(data.err.msg)
					}
				})
			} else {
				displayError('Please type again the password. There is a mismatch.')
			}
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

function registerNewUser() {
	return new Promise ((resolve, reject) => {
		$("#loginBox").hide("slow", () => {
			$("#registerBox").toggle("fast", () => {
				resolve()
			})
		})
	})
}

function loginRequest(){
	return new Promise((resolve, reject) => {
		var testerID= $("[name = 'testerID']").val()
		var password= $("[name = 'password']").val()
		$.post('/tester/login',
		{
			testerID : testerID,
			password : password
		},
		(data, status) => {
			if(data.OK) {
				var userInfo = data.OK
				console.log(userInfo.testerID + " : " + userInfo.isVerified)
				loginSuccess().then(() => {
					loadUserInfo(userInfo).then(() => {
						if(userInfo.isVerified) {
							loadDocumentManage().then((allDocumentNames) => {
										resolve()
							}).catch((err) => {
								reject(err)
							})
						}
					})
				})
			} else {
				$("p").remove("#loginWaring")
				$("#inputForm").prepend('<p class="w3-red" id="loginWaring"> The username or pass is invalid </p>')
				reject(data.err.msg)
			}
		})
	})
}

function logout () {
	$.get('tester/logout', (data, status) => {
		if(data.OK) {
			location.reload();
		} else {
			location.reload('/error_page');
		}
	})
}

function loadUserInfo(userInfo) {
	return new Promise((resolve, reject) => {
		$("#loginBox").hide("fast", () => {
			$("#userInfo").show("fast", () => {
				$("#userInfoTesterID").text(userInfo.testerID)
				$("#userInfoAdminRight").html(() => {
					return (userInfo.isVerified) ?
					'<span class="w3-green"> Could read and write document</span>' : '<span class="w3-red"> Can not write</span>'
				})
				resolve(userInfo)
			})
		})
	})
}

function loadDocumentManage() {
	return new Promise((resolve, reject) => {
		$.get('/tester/getAllDocumentName', (data, status) => {

			if(data.OK) {
				console.log(data.OK)
				$("#documentInfo").show("fast", () => {
					var allDoc = data.OK.msg
					for (var i in allDoc.documentOwners) {
						$("#documentInfoTable").append('<tr class="w3-hover-green">' +
											'<td style="width:60%;">' + allDoc.allDocumentNames[i] + '</td>' +
											'<td style="width:40%;">' + allDoc.documentOwners[i] + '</td>' +
										'</tr>')
					}
					resolve(allDoc)
				})
			} else {
				reject(data.err.msg)
			}
		})
	})
}

function checkLogin(){
	return new Promise((resolve, reject) => {
		$.get('/tester/login', (data, status) => {
			if(data.OK) {
				var userInfo = data.OK
				$("#userInfo").show("fast", () => {
					$("#userInfoTesterID").text()
				})
				resolve(userInfo)
			} else {
				reject('Not login yet!')
			}
		})
	})
}

function getVerification() {
	return new Promise((resolve, reject) => {
		$.get('/tester/getVerification', (data, status) => {
			if(data.OK) {
				resolve(data.OK.msg)
			} else {
				reject('Cannot get verification')
			}
		})
	})
}

function onLoginInput(e) {
	if(e.keyCode === 13) {
		loginRequest()
	}
}

$(document).ready(() => {
	return new Promise((resolve, reject) => {
			checkLogin().then((userInfo) => {
				loginSuccess().then(() => {
					loadUserInfo(userInfo).then((userInfo) => {
						if(userInfo.isVerified) {
							loadDocumentManage().then((allDocumentNames) => {
									resolve()
							})
						}
					})
				})
		}).catch((err) => {
			reject(err)
		})
	})
})
