'use strict'
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const form = require('multer')()

const Config = require('./config/Config.js')
const Tester = require('./router/tester.js')

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
app.use('/src', express.static('./views/src'))
app.use('/layout', express.static('./views/layout'))
app.use('/views', express.static('./views'))
// app.use('/iframe', express.static('./views/iframe'))
app.set('port', (process.env.PORT || 5000))
app.use('/tester', Tester)

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
