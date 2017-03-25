const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('Hello here : ' + req.body)
  res.status(200).json({OK: {msg: 'Login ok ahihi'}})
})

router.post('/', (req, res, next) => {
  console.log('Hello here : ' + req.body.testerID)
  res.status(200).json({OK: {msg: 'Login ok'}})
})

module.exports = router
