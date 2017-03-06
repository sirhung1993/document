'use strict';

const Global        = require ('./global.js');
const insert        = require ('./routes/insert.js')
const modify        = require ('./routes/modify.js')
const login         = require ('./routes/login.js')

Global.app.use ('/insert' , insert);
Global.app.use ('/modify' , modify);
Global.app.use ('/login' , login);
//parse application/x-www-form-urlencoded
Global.app.use (Global.bodyParser.urlencoded({ extended : false }));
Global.app.set ('view engine' , 'pug');
Global.app.set ('views' , './html')
Global.app.use (Global.express.static('html'));

//GET
Global.app.get('/' , function ( req , res , next) {
  // res.send ('Hello World!');
  res.render ('index');
});

Global.app.get('/download/:name' , function ( req , res , next) {
    let path = __dirname + '/uploads/' + req.params.name;
    res.download (path);
})

Global.app.listen (3000, function () {
  console.log('Server is running...');
})
