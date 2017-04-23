'use strict'
const Config = require('../config/Config.js')
const config = new Config()

const DB = require('./database.js')
const db = new DB()

const fs = require('fs')

const dbDocumentInfo = 'documentInfo'

module.exports = class dbDocument {

  constructor() {
    this.dbConnect = db.connectDB()
  }
/*
* Check whether the document name exists or Not
* if it exists resolve(true) if not resolve(false) if there is only 1 documentName
* exist
* else reject(err)
*/
  isDocumentExisted(documentName) {
    var checkExistedProcess = this.dbConnect.then((connection) => {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT id FROM ' + dbDocumentInfo + ' WHERE documentName = ?', documentName, (err, results, fields) => {
          if (!err) {
            var docName = results
            var quantity = docName.length
            if(quantity === 1) {
              connection.release()
              resolve(true)
            } else if (quantity === 0){
              // console.log('Inside dbDoc : ' + docName[0].id)
              connection.release()
              resolve(false)
            } else {
              connection.release()
              reject({err: {msg: 'There are two of them in Database - System ERR'}})
            }
          } else {
            reject(err)
          }
        })
      })
    }).catch((err) =>{
      return Promise.reject(err)
    })
    return checkExistedProcess
  }

  /*
  * Check that the document has been Stored in "documentStorageLocation"
  * If no err, return resolve() , if not return reject()
  *
  */

  isDocumentStored(documentName) {
    var pathToDocument = config.documentStorageLocation + '/' + documentName
    return new Promise((resolve, reject) => {
      var checkDocumentStoragePro = fs.stat(pathToDocument, (err, stats) => {
        if (!err) {
          resolve(stats.isFile())
        } else {
          /*
          * ENOENT means : No such file or directory
          */
          if (err.code === 'ENOENT') {
            resolve(false)
          } else {
            reject(err)
          }
        }
      })
    })
  }

  addNewADocument (documentName, documentContent, testerID) {
    var isDocumentExisted = this.isDocumentExisted(documentName)
    var isDocumentStored = this.isDocumentStored(documentName)
    var documentInfo = {
      documentName: documentName,
      testerID: testerID
    }

    var addNewDocProcess = Promise.all([isDocumentExisted, isDocumentStored]).then((values) => {

      return new Promise((resolve, reject) => {
        if(!(values[0] || values[1])) {
          console.log('New')
          resolve()
        } else if(!(values[0] && values[1])) {
          console.log('MISMATCH')
          reject({err: {msg: 'There is a mismatch between database and storage folder'}})
        } else {
          reject({err: {msg: 'It is not a new document name.Please change!'}})
        }
      })
    }).catch((err) => {
      // console.log(err)
      return Promise.reject(err)
    })

    var addNewDocProcess2 = addNewDocProcess.then(() => {
      return new Promise((resolve, reject) => {
        this.dbConnect.then((connection) => {
          connection.query('INSERT INTO ' + dbDocumentInfo + ' SET ?', documentInfo, (err, results, fields) => {
            if(!err) {
              console.log('Add db suscessfully!')
              resolve()
            } else {
              console.log(err)
              reject(err)
            }
          })
        }).catch((err) => {
          reject(err)
        })
      })
    }).catch((err) => {
      console.log(err)
      return Promise.reject(err)
    })
    return addNewDocProcess2
  }
}
