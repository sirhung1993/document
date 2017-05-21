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

    addNewDocument (documentName) {
      var addNewDocumentProcess = dbDocument.addNewADocument(documentName, this.testerID)
      addNewDocumentProcess.then(() => {
        return true
      }).catch((err) => {
        // console.log('Test : ' + id)
        return err
      })
      return addNewDocumentProcess
    }

    saveDocument (documentName, documentContent) {
      var saveDocumentPro = dbDocument.saveDocument(documentName, documentContent, this.testerID)
      saveDocumentPro.then(() => {
        return true
      }).catch((err) => {
        // console.log('Test : ' + id)
        console.log(err)
        return err
      })
      return saveDocumentPro
    }

    saveAndSubmitDocument(documentName, documentContent) {
      var saveAndSubmitDocumentPro = dbDocument.saveAndSubmitDocument(documentName, documentContent, this.testerID)
      saveAndSubmitDocumentPro.then(() => {
        return true
      }).catch((err) => {
        return err
      })

      return saveAndSubmitDocumentPro
    }

    getAllDocumentName() {
      var getAllDoc = dbDocument.getAllDocumentName()
      getAllDoc.then((docName) => {
        return docName
      }).catch((err) => {
        return err
      })
      return getAllDoc
    }

    getAllDocumentNameOfATester() {
      var getAllDoc = dbDocument.getAllDocumentNameOfATester(this.testerID)
      getAllDoc.then((docName) => {
        return docName
      }).catch((err) => {
        return err
      })

      return getAllDoc
    }

    getLatestContentOfDocument(documentName) {
      var getLatest = dbDocument.getLatestContentOfDocument(documentName,  this.testerID)
      getLatest.then((data) => {
        return data
      }).catch((err) => {
        return err
      })
      return getLatest
    }
}
