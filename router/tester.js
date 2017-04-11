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

module.exports = router
