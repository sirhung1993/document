'use strict'
const md5 = require('md5')

module.exports = {
  sessionSecret: 'rbtteamapidocument_session',
  dbUsername: 'document',
  dbPassword: 'rbtteamapidocument',
  dbDatabasename: 'document',
  dbconnectionLimit: 10,
  passwordKey: 'RBVH_RBT_TesterPassword',
  encryptingPassword: function (userPassword) {
    return md5(md5(userPassword + this.passwordKey))
  },
  /*
  * absolute path to slate/includes folder
  */
  documentStorageLocation: '/home/hungadmin/document_new/slate/source/includes',
  slateBundleExecFolder: '/home/hungadmin/document_new/slate',
  personalStorageLocation: '/home/hungadmin/data',
  slateFileLocation: '/home/hungadmin/document_new/slate/source/index.html.md',
  slateIncludePosition: 'includes:'
}
