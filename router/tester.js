const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('Hello here : ' + req.body)
  res.status(200).json({OK: {msg: 'Login ok ahihi'}})
})

router.post('/', (req, res, next) => {
  var testerID = req.body.testerID
  var password = req.body.password
  console.log('Hello here : ' + testerID + ' : ' + password)
  if (testerID === 'test' && password === 'test') {
    res.status(200).json({OK: {msg: 'Login ok'}})
  } else {
    res.json({err: {msg: 'Invalid password or username'}})
  }
})

module.exports = router
