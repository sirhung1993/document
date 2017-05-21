const express = require('express')
const Tester = require('../abstract/tester.js')
const xssFilters = require('xss-filters')

const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('Hello here : ' + req.body)
  res.status(200).json({OK: {msg: 'Login ok ahihi'}})
})

router.get('/logout', (req, res, next) => {
  if (req.session.tester) {
      req.session.destroy((err) => {
        res.status(200).json({OK: {msg: 'You have logged out suscessfully!'}})
      })
  } else {
    res.status(200).json({err: {msg: 'Not yet login or session is expire!!'}})
  }

})

router.post('/login', (req, res, next) => {
  var testerInfo = {
    testerID: req.body.testerID,
    password: req.body.password
  }
      var tester = new Tester(testerInfo)
      tester.testerLogin().then( () => {
          req.session.regenerate(function(err) {
            if(!err) {
              tester.getTesterVerification().then((isVerified) => {
                req.session.tester = testerInfo.testerID
                req.session.isVerified = isVerified
                res.status(200).json({OK: {
                  testerID: req.session.tester,
                  isVerified: req.session.isVerified
                }})
              }).catch((err) => {
                res.status(501).json({err: {msg: err}})
              })
            } else {
              res.status(500).json({err: {msg: err}})
            }
          })

        })
        .catch((err) => {
            res.status(200).json({err: {msg: err}})
        })
})

router.get('/login', (req, res, next) => {
  if(req.session.tester) {
    res.status(200).json({OK: {
      testerID: req.session.tester,
      isVerified: req.session.isVerified
    }})
  } else {
    res.status(200).json({err: {msg: 'You need to login first!'}})
  }
})

router.post('/register', (req, res, next) => {
  var testerInfo = {
    testerID: req.body.testerID,
    password: req.body.password
  }

  var tester = new Tester(testerInfo)
    tester.testerRegister().then(() => {
    res.status(200).json({OK: {msg: 'Register suscessfully!'}})
  })
  .catch((err) => {
    res.status(409).json({err: {msg: err}})
  })
})

router.get('/getVerification', (req, res, next) => {
  if(req.session.tester) {
    var tester = new Tester({testerID: req.session.tester})
    tester.getTesterVerification().then((isVerified) => {
      if(isVerified === true) {
          req.session.isVerified = true
          res.status(200).json({OK: {msg: isVerified}})
      } else {
        res.status(401).json({err: {msg: 'Your are not a verified user! Please contact ' +
      'admin to get the write permission'}})
      }
    }).catch((err) => {
      res.status(501).json({err: {msg: err}})
    })
  } else {
    res.status(401).json({err: {msg: 'You need to login first!'}})
  }
})
/*
* Set read-write permission for a USER by setting isVerified = 1
* only Verified user could set other's verification
*/
router.post('/setVerification', (req, res, next) => {
  if(req.session.tester) {
    var sourceTester = req.session.tester
    var targetTester = req.body.targetTester

    var tester = new Tester({testerID: req.session.tester})
    tester.setTesterVerification(targetTester).then(() => {
      res.status(200).json({err: {msg: 'Set verification to ' + targetTester + ' suscessfully!'}})
    }).catch((err) => {
      res.status(401).json(err)
    })
  } else {
    res.status(401).json({err: {msg: 'You need to login first!'}})
  }
})

router.post('/document/addnew', (req, res, next) => {
  if(req.session.tester) {
    if (req.session.isVerified === true) {
      var tester = new Tester({testerID: req.session.tester})
      var documentName = req.body.documentName

      tester.addNewDocument(documentName).then(() => {
        res.status(200).json({OK: {msg: 'Add new document suscessfully!'}})
      }).catch((err) => {
        res.status(200).json(err)
      })
    } else {
      res.status(401).json({err: {msg: 'You need to be a verified user in order to add new document!'}})
    }
  } else {
    res.status(401).json({err: {msg: 'You need to login first!'}})
  }
})

router.post('/document/save', (req, res, next) => {
  if(req.session.tester) {
    if(req.session.isVerified === true) {
      var tester = new Tester({testerID: req.session.tester})
      var documentName = req.body.documentName
      var documentContent = xssFilters.inHTMLData(req.body.documentContent)
      tester.saveDocument(documentName, documentContent).then(() => {
        return res.status(200).json({OK: {msg: 'You save the document suscessfully!'}})
      }).catch((err) => {
        res.status(400).json({err: {msg: err.code}})
      })
    } else {
      res.status(401).json({err: {msg: 'You need to be a verified user in order to add new document!'}})
    }
  } else {
    res.status(401).json({err: {msg: 'You need to login first!'}})
  }
})

router.post('/document/saveAndSubmit', (req, res, next) => {
  if(req.session.tester) {
    if(req.session.isVerified === true) {
      var tester = new Tester({testerID: req.session.tester})
      var documentName = req.body.documentName
      var documentContent = xssFilters.inHTMLData(req.body.documentContent)
      tester.saveAndSubmitDocument(documentName, documentContent).then(() => {
         res.status(200).json({OK: {msg: 'You save and submit the document suscessfully!'}})
         return 1
      }).catch((err) => {
        res.status(400).json({err: {msg: 'err'}})
      })
    } else {
      res.status(401).json({err: {msg: 'You need to be a verified user in order to add new document!'}})
    }
  } else {
    res.status(401).json({err: {msg: 'You need to login first!'}})
  }
})

router.get('/getAllDocumentName', (req, res, next) => {
  if(req.session.isVerified === true) {
    var tester = new Tester({testerID: req.session.tester})
    tester.getAllDocumentName().then((AllDocumentNames) => {
      res.status(200).json({OK: {msg: AllDocumentNames}})
      return 1
    })
  } else {
      res.status(401).json({err: {msg: 'You need to be a verified user in order to get information!'}})
      return 1
  }
})

router.get('/getAllDocumentNameOfATester', (req, res, next) => {
  if(req.session.isVerified === true) {
    var tester = new Tester({testerID: req.session.tester})
    tester.getAllDocumentNameOfATester().then((AllTesterDoc) => {
      res.status(200).json({OK: {msg: AllTesterDoc}})
      return 1
    })
  } else {
      res.status(401).json({err: {msg: 'You need to be a verified user in order to get information!'}})
      return 1
  }
})

router.get('/getLatestVersionOfCurrentUser/:documentName', (req, res, next) => {
  var documentName = req.params.documentName
  if(req.session.isVerified === true) {
    var tester = new Tester({testerID: req.session.tester})
    tester.getLatestContentOfDocument(documentName).then((data) => {
      res.status(200).json({OK: {msg: data}})
    }).catch((err) => {
      res.status(200).json({OK: {msg: err}})
    })
  } else {
      res.status(401).json({err: {msg: 'You need to be a verified user in order to get information!'}})
      return 1
  }
})

module.exports = router
