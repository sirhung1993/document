'use strict'
const mysql = require('mysql')
const Config = require('../config/Config.js')
const config = new Config()

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
            connection.query('SELECT id FROM testerInfo WHERE ' +
            ' testerID = ? and passWord = ?', [username, password] ,function(err, results, fields) {
              if (results.length === 1) {
                resolve()
              } else {
                reject({err: {msg : 'Invalid password or username'}})
              }
            })
          })

      }).catch((err) => {
        return Promise.reject(err)
      })

      return loginProcess
    }

    registerNew (username, password) {

    }

}
