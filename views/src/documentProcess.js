'use strict'

var documentProcess = new Promise((resolve, reject) => {
  $("#documentInfo").click(function () {
    $.get('tester/getAllDocumentName', (data, status) => {
      var allDocuments = data.OK
      console.log(allDocuments)
      if (allDocuments) {
        console.log('I am IN!')
        var documents = allDocuments.msg.allDocumentNames
        var owners = allDocuments.msg.documentOwners
        for(var i in documents) {
          $("documentInfoTable").append('<tr><td>' + documents[i] +
          '</td><td>' + owners[i] + '</td></tr>')
        }
        resolve()
      } else {
        reject('Cannot connect server')
      }
    })
  })


}).then(() => {

      console.log('allDocuments')

})
