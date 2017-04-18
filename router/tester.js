const express = require('express')
const Tester = require('../abstract/tester.js')

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
    res.status(401).json({err: {msg: 'Not yet login or session is expire!!'}})
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
              req.session.tester = testerInfo.testerID
              res.status(200).json({OK: {msg: 'Login ok'}})
            } else {
              res.status(500).json({err: {msg: err}})
            }
          })

        })
        .catch((err) => {
            res.json({err: {msg: err}})
        })
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
/*
* Set read-write permission for a USER by setting isVerified = 1
* only Verified user could set other's verification
*/
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
    })
  } else {
    res.status(401).json({err: {msg: 'You need to login first!'}})
  }
})

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
      tester.addNewDocument('testla')
    } else {
      res.status(401).json({err: {msg: 'You need to be a verified user in order to add new document!'}})
    }
  } else {
    res.status(401).json({err: {msg: 'You need to login first!'}})
  }
})

module.exports = router
