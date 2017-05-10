'use strict'
const mysql = require('mysql')
const fs = require('fs')
const Config = require('../config/Config.js')
const config = new Config()

/*
* Table name are listed here
*/
const dbTesterInfo = ' testerInfo '

module.exports = class Database {
    constructor () {
      this.pool  = mysql.createPool({
        connectionLimit: config.dbconnectionLimit,
        host: 'localhost',
        user: config.dbUsername,
        password: config.dbPassword,
        database: config.dbDatabasename
      });
    }
/*
* connect to database and return a promis with connection
* else return a promise with err
*/

  connectDB() {
    return new Promise ((resolve, reject) => {
      this.pool.getConnection(function(err, connection){
        if (!err) {
          resolve(connection)
        } else {
          reject(err)
        }
      })
    })
  }

/*
* Check if and only if there is only one row of Username and password
* return true else false
*/
    loginCheck(username, password) {
      var connectionDB = this.connectDB()
      var loginProcess = connectionDB.then((connection) => {
          return new Promise ((resolve, reject) => {
            connection.query('SELECT id FROM' + dbTesterInfo +' WHERE ' +
            ' testerID = ? and passWord = ?', [username, password] ,function(err, results, fields) {
              if (results.length === 1) {
                resolve()
              } else {
                reject({err: {msg : 'Invalid password or username'}})
              }
            })
            connection.release()
          })

      }).catch((err) => {
        return Promise.reject(err)
      })

      return loginProcess
    }
    /*
    * Create new user with given name and password
    * then create a personalStorageLocation for each new user
    * return a Promise
    */
    registerNew (username, password) {

      var testerInfo = {
        testerID: username,
        passWord: password
      }

      var connectionDB = this.connectDB()
      var registerProcess = connectionDB.then((connection) => {
        return new Promise((resolve, reject) => {
          connection.query('SELECT id FROM ' + dbTesterInfo + ' WHERE ' +
          ' testerID = ?', testerInfo.testerID, (err, results, fields) => {
            if(!err) {
              if (results.length === 0) {
                resolve(connection)
              } else {
                connection.release()
                reject({err: {msg: 'The username has been used!'}})
              }
            } else {
              reject(err)
            }
          })
        })
      }).catch((err) => {
        return Promise.reject(err)
      })

      var registerProcess2 = registerProcess.then ((connection) => {
        return new Promise ((resolve, reject) => {
          connection.query('INSERT INTO ' + dbTesterInfo + 'SET ?', testerInfo, (err, results, fields) => {
            if (!err){
              connection.release()
              resolve()
            } else {
              reject(err)
            }
          })
        })
      }).catch ((err) => {
        // connection.release()
        return Promise.reject(err)
      })

      var registerProcess3 = registerProcess2.then((connection) => {
        return new Promise ((resolve, reject) => {
          fs.mkdir(config.personalStorageLocation + '/' + username, 0o700,
          (err) => {
            if(!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        })
      })

      return registerProcess3
    }
    /*
    * Check if and only if there is only one row of Username
    * return a promise
    */
    isUserExistenceAndUnique(username) {
      var connectionDB = this.connectDB()
      var checkExistenceAndUniqueProcess = connectionDB.then((connection) => {
        return new Promise((resolve, reject) => {
          connection.query('SELECT id FROM ' + dbTesterInfo +
          ' WHERE testerID = ?', username, (err, results, fields) => {

              if (!err) {
                if(results.length === 1) {
                  connection.release()
                  resolve()
                } else if (results.length === 0){
                  connection.release()
                  reject({err: {msg: 'This username does not exist!'}})
                } else {
                  connection.release()
                  reject({err: {msg: 'This username is duplicated!Please remove!'}})
                }
              } else {
                connection.release()
                reject({err: {msg: 'Lost database connection!'}})
              }
            })
        })
      }).catch((err) => {
        return Promise.reject(err)
      })
      return checkExistenceAndUniqueProcess
    }

    getUserVerificationStatus(username) {
      var getUserVerificationProcess = this.isUserExistenceAndUnique(username).then(() => {
        var connectionDB = this.connectDB()
        var getUserVerificationProcess2 = connectionDB.then((connection) => {
            return new Promise((resolve, reject) => {
              connection.query('SELECT isVerified FROM ' + dbTesterInfo + ' WHERE testerID = ?', username, (err, results, fields) => {
                if (!err) {
                  var isVerified = (results[0].isVerified) ? true : false
                  resolve(isVerified)
                } else {
                  reject(err)
                }
              })
            })
        }).catch((err) => {
          return Promise.reject(err)
        })
        // need to clear this later - very messy here
        return getUserVerificationProcess2
      }).catch((err) => {
        return Promise.reject(err)
      })
      return getUserVerificationProcess
    }
/*
* sourceUser need to be a verified user in order to set other user - targetUser
*/
    setVerificationToAnUser (sourceUsername, targetUser) {
      var setUserVerification = this.getUserVerificationStatus(sourceUsername).then((isVerified) =>{
        return new Promise ((resolve, reject) => {
          if (isVerified === true) {
            resolve()
          } else {
            reject({err: {msg: 'It need to be a verified user to do this action!'}})
          }
        }).catch ((err) => {
          return Promise.reject(err)
        })
      })

      var setUserVerification2 = setUserVerification.then(() => {
        return new Promise((resolve, reject) => {
          this.isUserExistenceAndUnique(targetUser).then(() => {
            resolve()
          }).catch((err) => {
            reject(err)
          })
        })
      })

      var setUserVerification3 = setUserVerification2.then(() => {
        return new Promise ((resolve, reject) => {
          this.connectDB().then((connection) => {
            connection.query('UPDATE ' + dbTesterInfo + 'SET isVerified = 1 WHERE testerID = ?', targetUser, (err, results, fields) => {
              if (!err) {
                connection.release()
                resolve()
              } else {
                connection.release()
                reject(err)
              }
            })
          })
        })
      })

      return setUserVerification3
    }
}
