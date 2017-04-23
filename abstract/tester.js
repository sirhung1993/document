'use strict'
const Config = require('../config/Config.js')
const config = new Config()
const fs = require('fs')

const DB = require('./database.js')
const db = new DB()
const DBDocument = require('./dbDocument.js')
const dbDocument = new DBDocument()

module.exports = class Tester {
    constructor (Tester) {
      this.testerID = Tester.testerID
      this.password = config.encryptingPassword(Tester.password)
      this.isVerified = Tester.isVerified || false
    }

    testerLogin() {
      var loginProcess = db.loginCheck(this.testerID, this.password)
      loginProcess.then( () => {
        return true
      }).catch ( (err) => {
        return err
      })
      return loginProcess
    }

    testerRegister() {
      var registerProcess = db.registerNew(this.testerID, this.password)
      registerProcess.then( () => {
        return true
      }).catch ( (err) => {
        return err
      })
      return registerProcess
    }

    getTesterVerification() {
      var getVerificationProcess = db.getUserVerificationStatus(this.testerID)
      getVerificationProcess.then( (isVerified) => {
        return isVerified
      }).catch ( (err) => {
        return err
      })
      return getVerificationProcess
    }

    setTesterVerification(targetTester) {
      var setVerificationProcess = db.setVerificationToAnUser(this.testerID, targetTester)
      setVerificationProcess.then(() => {
        return true
      }).catch ((err) => {
        return err
      })
      return setVerificationProcess
    }

    addNewDocument (documentName, documentContent) {
      var addNewDocumentProcess = dbDocument.addNewADocument(documentName, documentContent, this.testerID).then(() => {
        // console.log('ADD NEW')
      }).catch((id) => {
        // console.log('Test : ' + id)
      })
    }
}
