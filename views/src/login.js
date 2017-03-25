var loginProcess = new Promise ((resolve, reject) => {
  $(document).ready(function () {
    $('#login').click(function () {
      // $('p').hide()
      $('#test').load('views/iframe/login_iframe.ejs', null, function (responseTxt, statusTxt, xhr) {
        if(statusTxt === 'success') {
          resolve()
        } else {
            reject({err: {msg: 'Error: ' + xhr.status + ': ' + xhr.statusText}})
        }
      })
    })
  })
})

loginProcess.then(() => {
  $('#loginButton').click(function () {
    $.post('tester', {
      testerID: $('[name = \'testerID\']').val(),
      password: $('[name = \'password\']').val()
    }, function (data, status) {
      alert(status + ' ' + data.OK.msg)
      console.log(status)
    })
  })
})

loginProcess.catch ( (err) => {
  console.log(err)
})
