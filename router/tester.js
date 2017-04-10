const express = require('express')
const Tester = require('../abstract/tester.js')

const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('Hello here : ' + req.body)
  res.status(200).json({OK: {msg: 'Login ok ahihi'}})
})

router.get('/logout', (req, res, next) => {

})

router.post('/login', (req, res, next) => {
  var testerInfo = {
    testerID: req.body.testerID,
    password: req.body.password
  }

  var tester = new Tester(testerInfo)
  tester.testerLogin().then( () => {
      res.status(200).json({OK: {msg: 'Login ok'}})
    })
    .catch((err) => {
        res.json({err: {msg: err}})
    })
  })

module.exports = router
