'use strict'
const express = require('express')
const session = require('express-session')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const form = require('multer')()
const cmd = require('node-cmd')
const Config = require('./config/Config.js')
const Tester = require('./router/tester.js')

// console.log()

const app = express()
const config = new Config('PRO')


  cmd.get('cd /home/hungadmin/document_new/slate/ && bundle exec middleman server', (err, data, stderr) => {
    if(data) {
      console.log(data)
    } else {
      console.log(err + ' --- ' + stderr)
    }

  })

app.use(helmet())
// app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.set('trust proxy', 1)
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  proxy: true,
  cookie: {
    secure: true,
    maxAge: 3600000,
    httpOnly: false
   }
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use('/src', express.static('./views/src'))
app.use('/layout', express.static('./views/layout'))
app.use('/views', express.static('./views'))
app.set('port', (process.env.PORT || 5000))
app.use('/tester', Tester)

app.get('/', function (req, res, next) {
  res.render('pages/index')
})

app.get('(error_page|*)' , function ( req , res , next) {
    res.status(404).render ('pages/error_page')
})

app.listen(app.get('port'), () => {
  console.log('Server is running at : ' + app.get('port'))
})
