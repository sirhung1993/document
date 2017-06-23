'use strict'

function loginSuccess() {
	return new Promise(function ( resolve, reject )  {
		$("#login").hide(function ( )  {
			$("#register").hide(function ( )  {
				
			})
		})
        $("#logout").show()
		resolve()
	})
}

function ExitPhotosViews()
{
    $("#Back2Doc").hide()
    $("#MainPage").show();
    $("#ImageColect").fadeOut("slow", function(){
        $("#DocManage").fadeIn("slow")  
    })
    
}

function PhotosView()
{
    
    $("#ImageColect").attr("src", "/upload")
    $("#MainPage").hide()
    $("#Back2Doc").show();
    $("#DocManage").fadeOut("slow", function (){
        $("#ImageColect").fadeIn("slow")
    })    
}

function loadEdittor() {
	return new Promise(function ( resolve, reject )  {
		$("#editor").show(function ( )  {
			resolve()
		})
	})
}

function regRequest() {
	return new Promise(function ( resolve, reject )  {
		var regTesterID = $("[name = regTesterID]").val()
		var regPassword1 = $("[name = regPassword1]").val()
		var regPassword2 = $("[name = regPassword2]").val()
		// console.log(regTesterID + " : " + regPassword1 + " : " + regPassword2)
		if(regTesterID && regPassword1 && regPassword2) {
			if(regPassword1 === regPassword2) {
				$.post('tester/register', {
					testerID: regTesterID,
			    password: regPassword1
				}, function ( data, status )  {
					if (data.OK) {
						console.log(data.OK.msg)
						displaySuccess('Register suscessfully! Please contact admin to get read/write access! This page will be reload in 5 seconds')
						setTimeout(function ( )  {
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
			$("#inputMissing").show("fast", function ( )  {
				setTimeout(function ( )  {
					$(".warningBox").hide("fast", function ( )  {
						resolve()
					})
				}, 5000)
		})
		}
	})
}

function registerNewUser() {
    //alert("registerNewUser");
    $("#loginBox").hide("fast");
    $("#registerBox").toggle("slow");
	// return new Promise (function ( resolve, reject )  {
		// $("#loginBox").hide("fast", function ( )  {});
			// $("#registerBox").toggle("slow", function ( )  {
				// resolve();
			// });
		
	// });
}

function loginRequest(){
	return new Promise(function ( resolve, reject )  {
		var testerID= $("[name = 'testerID']").val()
		var password= $("[name = 'password']").val()
		$.post('/tester/login',
		{
			testerID : testerID,
			password : password
		},
		function ( data, status )  {
			if(data.OK) {
				var userInfo = data.OK
				console.log(userInfo.testerID + " : " + userInfo.isVerified)
				loginSuccess().then(function ( )  {
					loadUserInfo(userInfo).then(function ( )  {
						if(userInfo.isVerified) {
							loadDocumentManage().then(function ( allDocumentNames )  {
										resolve()
							}).catch(function ( err )  {
								reject(err)
							})
						}
					})
				})
                $("#TesterLogName").html(userInfo.testerID)
			} 
            else {
				$("p").remove("#loginWaring")
				$("#inputForm").prepend('<p class="w3-red" id="loginWaring"> The username or pass is invalid </p>')
				reject(data.err.msg)
			}
		})
        
	})
}

function logout () {
	$.get('tester/logout', function ( data, status )  {
        $("#TesterLogName").html("")
		if(data.OK) {
			location.reload();
		} else {
			location.reload('/error_page');
		}
	})
}

function loadUserInfo(userInfo) {
	return new Promise(function ( resolve, reject )  {
		$("#loginBox").hide("fast", function ( )  {
			//$("#userInfo").show("fast", function ( )  {
				//$("#userInfoTesterID").text(userInfo.testerID)
				$("#userInfoAdminRight").html(function ( )  {
					return (userInfo.isVerified) ?
					'Could read and write document' : 'Can not write'
				})
				resolve(userInfo)
			//})
		})
	})
}

function loadDocumentManage() {
    $("footer").attr("style","position:relative")
	return new Promise(function ( resolve, reject )  {
		$.get('/tester/getAllDocumentName', function ( data, status )  {

			if(data.OK) {
				console.log(data.OK)
				$("#DocManage").show("fast", function ( )  {
                    $("#editor").show();
					var allDoc = data.OK.msg
					for (var i in allDoc.documentOwners) {
						$("#documentInfoTable").append('<tr class="w3-hover-green" onclick="selectedDocument(this)" style="cursor:pointer">' +
											'<td style="width:100%;"><span >' + allDoc.allDocumentNames[i] + 
                                            '</span><p class="w3-small w3-right-align"> <i>by </i><span class="w3-normal"><b>' + allDoc.documentOwners[i] + '</b><span></p>'+
                                            '</td>' 
											 +
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
	return new Promise(function ( resolve, reject )  {
		$.get('/tester/login', function ( data, status )  {
			if(data.OK) {
				var userInfo = data.OK
				$("#userInfo").show("fast", function ( )  {
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
	return new Promise(function ( resolve, reject )  {
		$.get('/tester/getVerification', function ( data, status )  {
			if(data.OK) {
				resolve(data.OK.msg)
			} else {
				reject('Cannot get verification')
			}
		})
	})
}

function ShowHidePassword(sender,Pswbox){
    
    var PasswordBox = $("#"+Pswbox)
    
    if (PasswordBox.attr("type") === "password")
    {
        PasswordBox.attr("type","text")
        sender.innerHTML = "Hide"
    }
    else{
        PasswordBox.attr("type","password")
        sender.innerHTML = "Show"
    }

}

function onLoginInput(e) {
	if(e.keyCode === 13) {
		loginRequest()
	}
}

$(document).ready(function ( )  {
    $("#FileBrowser").change( function(evt){
        var myFile = document.getElementById("FileBrowser").files[0].name +" (" + document.getElementById("FileBrowser").files[0].size/8 +" bytes)"
        console.log(myFile)
        $("#UploadFile").val(myFile)
        
    })
    // $('#form').submit(function(){
        // $.ajax({
            // url: $('#form').attr('action'),
            // type: 'post',
            // enctype:'multipart/form-data',
            // success: function(redata){
                // alert(redata.OK.msg);   
                // $("#uploadOk").show( )
            // },
            // error: function(redata){
                // alert("Error");
            // }
        // });
    // return false;
    // });
    $.get("/upload/allFileNames", function(data, status){
        
        if (data.OK){
            var imageArray = data.OK.msg;
            
            for(var i = 0; i< imageArray.length; i++){
                var itm = document.getElementById("ImageContainer");
                var cln = itm.cloneNode(true);
                var img = cln.childNodes[1]
                var title = cln.childNodes[3]
                cln.style.display = "block"
                img.setAttribute("src", "../views/pictures/" + imageArray[i])
                img.setAttribute("alt", imageArray[i])
                var bigimg = cln.childNodes[5]
                console.log(bigimg);
                bigimg.innerHTML = "<div class=\"w3-light-blue\"><img src=\"\../views/pictures/" + imageArray[i]+"\" style=\"margin:2px;width:500px\"/></div>"
                //title.innerHTML = "<b>" + imageArray[i] + "</b>"
                document.getElementById("ImagesContainer").appendChild(cln)
            }
        }else{
           // alert(data.err.msg)
        }
    });
	return new Promise(function ( resolve, reject )  {
			checkLogin().then(function ( userInfo )  {
				loginSuccess().then(function ( )  {
					loadUserInfo(userInfo).then(function ( userInfo )  {
						if(userInfo.isVerified) {
							loadDocumentManage().then(function ( allDocumentNames )  {
									resolve()
							})
						}
					})
				})
		}).catch(function ( err )  {
			reject(err)
		})
	})
})
function CopyToClipboard(element)
{
    var parent = element.parentNode;
    var img = parent.childNodes[1]
    
    var Text = "<img src=\"" + img.getAttribute("src") + "\"/>"
    
    console.log(Text)
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(Text).select();
    document.execCommand("copy");
    $temp.remove();
    $("#CopyOk").show(function(){
        setTimeout(function(){
            $("#CopyOk").hide(200)
        } , 1000)
    })
}

function BrowseFile()
{
    $("#FileBrowser").click();
}