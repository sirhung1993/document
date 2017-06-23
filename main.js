'use strict'
const express = require('express')
const session = require('express-session')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cmd = require('node-cmd')
const Config = require('./config/Config.js')
const Tester = require('./router/tester.js')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'views/pictures')
  },
  filename: function(req, file, cb) {
    // console.log(file)
    var extension = path.extname(file.originalname)
    cb(null, path.basename(file.originalname, extension)  + '-' + Date.now() + extension)
  }
})
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

app.use(function(req, res, next) {
	var schema = req.headers['x-forwarded-proto']
	if (schema === 'https') {
		next()
	} else {
		res.redirect('https://' + req.headers.host + req.url);
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
// app.use('/download', express.static('./software'))
app.set('port', (process.env.PORT || 5000))
app.use('/tester', Tester)

app.get('/', function (req, res, next) {
  res.render('pages/index')
})

app.get('/upload', function (req, res, next) {
  if(req.session.isVerified === true) {
    res.render('pages/upload')
  } else {
    res.render('pages/index')
  }
})

app.get('/upload/allFileNames', function (req, res, next) {
  if(req.session.isVerified === true) {
    fs.readdir('views/pictures', function(err, files) {
      if(!err) {
        res.status(200).json({OK: {msg: files}})
      } else {
        res.status(404).json({err: {msg: 'Server Error! Please contact admin for further information'}})
      }
    })
  } else {
    res.render('pages/index')
  }
})


app.post('/upload/picture' ,function (req, res, next){

  if(req.session.isVerified === true) {
    var upload = multer({
      storage: storage
    }).single('uploadFileName')    

    upload(req, res, function(err) {
      if(!err) {
        // console.log('Upload suscessfully!')
        res.status(200).json({OK: {msg: 'Upload suscessfully!'}})
      } else {
        console.log(err)
      }
    })

  } else {
     res.render('pages/index')
  }
})

app.get('/download/:file', function (req, res, next) {
  var filename = req.params.file
  fs.readdir('./software', function(err, files) {
    if(!err) {
      var isExisted = files.indexOf(filename)
      if(isExisted >= 0) {
        res.download('./software/'+ filename, function(err) {
          if(err) {
            console.log(err)
          }
        })
      } else {

      }
    } else {
      res.status(501).json({err: {msg: 'There is an internal error!' + err}})
    }
  })

})

app.get('(error_page|*)' , function ( req , res , next) {
    res.status(404).render ('pages/error_page')
})

app.listen(app.get('port'), () => {
  console.log('Server is running at : ' + app.get('port'))
})
