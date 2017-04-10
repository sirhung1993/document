'use strict'
const md5 = require('md5')
const DB = require('./database.js')
const db = new DB()

module.exports = class Tester {
    constructor (Tester) {
      this.testerID = Tester.testerID,
      this.password = Tester.password
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
}
