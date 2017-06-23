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
              //connection.release()
              resolve(true)
            } else if (quantity === 0){
              // console.log('Inside dbDoc : ' + docName[0].id)
              //connection.release()
              resolve(false)
            } else {
              //connection.release()
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
  * add an empty file to includes folder
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

  addNewADocument (documentName, testerID) {
    var originalSlateContent
    var isDocumentExisted = this.isDocumentExisted(documentName)
    var isDocumentStored = this.isDocumentStored(documentName)
    var documentInfo = {
      documentName: documentName,
      testerID: testerID
    }

    var addNewDocProcess = Promise.all([isDocumentExisted, isDocumentStored]).then((values) => {
      return new Promise((resolve, reject) => {
        if(!(values[0] || values[1])) {
          resolve()
        } else if(!(values[0] && values[1])) {
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
              // //connection.release()
              resolve()
            } else {
              // //connection.release()
              reject(err)
            }
          })
        }).catch((err) => {
          reject(err)
        })
      })
    }).catch((err) => {
      return Promise.reject(err)
    })

    var addNewDocProcess3 = addNewDocProcess2.then(() => {
      return new Promise ((resolve, reject) => {
        var storageLocation = config.documentStorageLocation + '/' + documentName + '.md'
        fs.writeFile(storageLocation, '', {
          encoding: 'utf8',
          mode: 0o700,
          flag: 'wx'
        },(err) => {
          if (!err) {
            resolve()
          } else {
            console.log(err)
            reject(err)
          }
        })
      })
    })

    var addNewDocProcess4 = addNewDocProcess3.then(() => {
      return new Promise ((resolve, reject) => {
        try {
          originalSlateContent =
           fs.readFileSync(config.slateFileLocation, {
             encoding: 'utf8',
             flag: 'r'
           })
           var modifiedContent =  originalSlateContent.replace(config.slateIncludePosition, config.slateIncludePosition + '\n' + '  - ' + documentName)
           if (modifiedContent) {
             fs.writeFileSync(config.slateFileLocation, modifiedContent, {
               encoding: 'utf8',
               mode: 0o700,
               flag: 'w'
             })
           }
        } catch(err) {
          reject({err: {msg: '' + err}})
        }
        resolve()
      })
    }).catch((err) => {
      return Promise.reject(err)
    })

    return addNewDocProcess3
}

  /*
  * Check that the document exist in Database then
  * Save the current document into personalStorageLocation as a AutoSave copy
  * The SLATE page are not UPDATE after saveDocument
  * resolve() if correct and reject(err) if not
  */

  saveDocument (documentName, documentContent, testerID) {
    var saveDocumentPro = this.isDocumentExisted(documentName).then((isDocumentExisted) => {
      return new Promise((resolve, reject) => {
        if(isDocumentExisted === true) {
          resolve()
        } else {
          // console.log('FAIL : ' + isDocumentExisted)
          reject(isDocumentExisted)
        }
      })
      }).catch((err) => {
        return Promise.reject(err)
      })

    // var versionByDate = new Date().getTime()
    var storageLocation = config.personalStorageLocation + '/' + testerID + '/' + documentName + '-AutoSave' + '.md'

    var saveDocumentPro1 = saveDocumentPro.then(() => {
      // console.log(documentContent)
      // console.log(storageLocation)
      return new Promise((resolve, reject) => {
        fs.writeFile(storageLocation, documentContent, {
          encoding: 'utf8',
          mode: 0o700,
          flag: 'w+'
        },(err) => {
          if (!err) {
            resolve()
          } else {
            // console.log(err)
            reject(err)
          }
        })
      })
    }).catch((err) => {
      return Promise.reject(err)
    })

    return saveDocumentPro1
  }
  /*
  * 1/ save the current conttent to AutoSave file
  * 2/ create a versionByDate file
  * 3/ Update the official document used for SLATE reference
  * 4/ Set isReleased status to YES in DB
  * Update SLATE page
  *
  */
  saveAndSubmitDocument (documentName, documentContent, testerID) {
    var saveAndSubmitProcess = this.saveDocument(documentName, documentContent, testerID).then(() => {
      return new Promise((resolve, reject) => {
        var versionByDate = new Date().getTime()
        var storageLocation = config.personalStorageLocation + '/' + testerID + '/' + documentName + '-' + versionByDate + '.md'
        fs.writeFile(storageLocation, documentContent, {
          encoding: 'utf8',
          mode: 0o700,
          flag: 'wx'
        }, (err) => {
          if(!err) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }).catch((err) => {
      return Promise.reject(err)
    })

    var saveAndSubmitProcess2 = saveAndSubmitProcess.then(() => {
      return new Promise((resolve, reject) => {
        var slateDocumentFileLocation = config.documentStorageLocation + '/' + documentName + '.md'

        fs.writeFile(slateDocumentFileLocation, documentContent, {
          encoding: 'utf8',
          mode: 0o700,
          flag: 'w+'
        }, (err) => {
          if (!err) {
            resolve()
          } else {
            reject(err)
          }
        })
      })
    }).catch((err) => {
      return Promise.reject(err)
    })

    var saveAndSubmitProcess3 = saveAndSubmitProcess2.then(() => {
      return new Promise((resolve, reject) => {
        this.dbConnect.then((connection) => {
          connection.query('UPDATE ' + dbDocumentInfo + ' SET isReleased = 1 WHERE documentName = ?', documentName,
          (err, results, fields) => {
            if(!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        })
      })
    }).catch((err) => {
      return Promise.reject(err)
    })

    return saveAndSubmitProcess3
}
  getAllDocumentName() {
    return new Promise ((resolve, reject) => {
      this.dbConnect.then((connection) => {
        connection.query('SELECT documentName, testerID FROM ' + dbDocumentInfo + ' ORDER BY id DESC',
      (err, results, fields) => {
        if(!err) {
          // console.log(results)
          var allDocumentNames = []
          var documentOwners = []
          for (var i in results) {
            allDocumentNames.push(results[i].documentName)
            documentOwners.push(results[i].testerID)
          }
          resolve({
            allDocumentNames: allDocumentNames,
            documentOwners: documentOwners
          })
        } else {
          reject(err)
        }
      })
      }).catch((err) => {
        reject(err)
      })
    })
  }

  getAllDocumentNameOfATester(testerID) {
    return new Promise ((resolve, reject) => {
      this.dbConnect.then((connection) => {
        connection.query('SELECT documentName FROM ' + dbDocumentInfo
        + ' WHERE testerID = ?', testerID,
      (err, results, fields) => {
        if(!err) {
          var allDocumentNames = []
          for (var i in results) {
            allDocumentNames.push(results[i].documentName)
          }
          resolve(allDocumentNames)
        } else {
          reject('The testerID does not exist!')
        }
      })
      }).catch((err) => {
        reject(err)
      })
    })
  }
/*
* get the latest document of User in PersonalStorage of current user
* if not exist get in the INCLUDES folder
*/
  getLatestContentOfDocument(documentName, testerID) {
    var getLatestDoc1 = new Promise((resolve, reject) => {
      var storageLocation = config.personalStorageLocation + '/' + testerID + '/' + documentName + '-AutoSave' + '.md'
      fs.readFile(storageLocation,
        {
          encoding: 'utf8',
          flag: 'r'
        }, (err,data) => {
          if(!err) {
            resolve(data)
          } else {
            reject(err)
          }
        })
    })
    var getLatestDoc2= getLatestDoc1.catch((err) => {
      return new Promise((resolve, reject) => {
        var slateIncudesFolder = config.documentStorageLocation + '/' +
        documentName + '.md'
        fs.readFile(slateIncudesFolder,
        {
          encoding: 'utf8',
          flag: 'r'
        }, (err, data) => {
          if(!err) {
            resolve(data)
          } else {
            reject(err)
          }
        })
      })
    })

    return (getLatestDoc2) ? getLatestDoc2 : getLatestDoc1
  }

}
