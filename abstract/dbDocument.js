'use strict'
const Config = require('../config/Config.js')
const config = new Config()

const DB = require('./database.js')
const db = new DB()

const dbDocumentInfo = 'documentInfo'

module.export = class dbDocument {

  constructor() {
    this.dbConnect = db.connectDB()
  }

  addNewADocument = function(documentName, testerID) {
    var addNewDocProcess = this.connectDB().then(() => {
      console.log('OK, im in dbDocument!')
    }).catch((err) => {
      console.log(err)
    })

    return addNewDocProcess
  }
}
