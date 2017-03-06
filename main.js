'use strict'
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const form = require('multer')()
const Config = require('./config/Config.js')

const app = express()
const config = new Config('PRO')

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use('/layout', express.static('./views/layout'))
app.set('port', (process.env.PORT || 3000))

app.get('/', function (req, res, next) {
  // res.send ('Hello World!')
  res.render('pages/index')
})

// app.get('/download/:name' , function ( req , res , next) {
//     let path = __dirname + '/uploads/' + req.params.name
//     res.download (path)
// })

app.listen(app.get('port'), () => {
  console.log('Server is running at : ' + app.get('port'))
})
