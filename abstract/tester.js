'use strict'
const Config = require('../config/Config.js')
const config = new Config()

const DB = require('./database.js')
const db = new DB()
const dbDocument = require('./dbDocument.js')

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

    addNewDocument (documentName) {
      var addNewDocumentProcess = db.addNewADocument(documentName, this.testerID).then(() => {

      })
    }
}
