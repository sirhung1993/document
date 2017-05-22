'use strict'
const fs = require('fs')
const path = require('path')

let productionConfigDoesNotExist
let productionConfigurationPath = path.join(__dirname, '/ProConfig.js')
try {
  fs.accessSync(productionConfigurationPath, fs.constants.R)
} catch (e) {
  productionConfigDoesNotExist = e
}

module.exports = class Config {
  constructor (DEVorPro) {
    if (DEVorPro === 'DEV' || productionConfigDoesNotExist) {
      // For Development Version
      this.dbUsername = 'test'
      this.dbPassword = 'testpassword'
      this.dbHostname = 'testhostname'
      this.dbDatabasename = 'testDBname'
      this.sessionSecret = 'testSecret'
      this.passwordKey = 'passwordKey'
      this.encryptingPassword = function(username) {
        return username + 'It need to be encrypted here'
      }
      this.documentStorageLocation = 'path/to/slate/includes'
      this.personalStorageLocation = 'path/to/data'
      this.slateFileLocation = 'path/to/slate/index.html.md'
      this.slateIncludePosition = 'includes'
      this.slateBundleExecFolder = 'path/to/slate'
    } else if (DEVorPro === 'PRO' || productionConfigDoesNotExist === undefined) {
      //  For Production Version
      let productionConfigurationPath = path.join(__dirname, '/ProConfig.js')
      const ProConfig = require(productionConfigurationPath)
      this.dbUsername = ProConfig.dbUsername
      this.dbPassword = ProConfig.dbPassword
      this.dbHostname = ProConfig.dbHostname
      this.dbDatabasename = ProConfig.dbDatabasename
      this.sessionSecret = ProConfig.sessionSecret
      this.encryptingPassword = ProConfig.encryptingPassword
      this.documentStorageLocation = ProConfig.documentStorageLocation
      this.personalStorageLocation = ProConfig.personalStorageLocation
      this.slateFileLocation = ProConfig.slateFileLocation
      this.slateIncludePosition = ProConfig.slateIncludePosition
      this.slateBundleExecFolder = ProConfig.slateBundleExecFolder
    }
  }
  }
