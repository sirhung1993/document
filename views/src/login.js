'use trict'
var login1 = $(document).ready(function () {
    $('#login').click(function () {
    $('#test').load('views/iframe/login_iframe.ejs', null, function (responseTxt, statusTxt, xhr) {
        if(statusTxt === 'success') {
          $('#loginButton').click(function () {

              $.post('tester', {
                testerID: $('[name = \'testerID\']').val(),
                password: $('[name = \'password\']').val()
              }, function (data, status) {
                if (data.OK) {
                  return new Promise ((resolve, reject) => {
                    resolve(data.OK.msg)
                  })
                } else {

                }
              })
            })
        } else {

        }
      })
    })
  })

login1.then((msg) => {
    console.log("FALSE")
})
