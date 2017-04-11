'use strict'
const md5 = require('md5')

const Config = require('../config/Config.js')
const config = new Config()

const DB = require('./database.js')
const db = new DB()

module.exports = class Tester {
    constructor (Tester) {
      this.testerID = Tester.testerID,
      this.password = md5(md5(Tester.password + config.passwordKey))
    }

    testerLogin() {
      console.log(this.password)
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
}
