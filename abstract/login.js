'use strict'
//080027486B4D
const Global = require ('../global.js');

Global.router.use(Global.session({
    secret: Global.keyAut,
    resave: false,
    saveUninitialized: true
}));

Global.router.get ('/profile' , function (req, res, next) {
    if (req.session.user) {
        res.json (req.session.user);
    } else {
        res.status (400).json ({err : {msg : 'You are not authorized!'}})
    }
});

// parse application/x-www-form-urlencoded
Global.router.use(Global.bodyParser.urlencoded({
                                    extended: false,
                                    inflate: true }))
// parse application/json
Global.router.use(Global.bodyParser.json())
//session
Global.router.use (Global.session( {
  secret            : Global.keyAut,
  resave            : false,
  saveUninitialized : true
} ));

// Global.rootPool.connect();

Global.router.post ('/' , Global.form.single() ,function (req , res , next) {

  let username = req.body.username;
  let password = Global.md5(req.body.password + Global.keyMd5);

  if (!username || !password){
    res.status(400).json ( {err : {msg :
      'Invalid password or username!'} } );
    return;
  }

  Global.rootPool.query ('SELECT * FROM `users` where' +
  ' `userName` = ? AND `passWord` = ?', [username,password] ,
    function ( err , rows , fields) {
        // console.log(rows);
    if (!rows.length) {
      res.status(401).json ( {err :
        { msg : 'The username does not exist or password is invalid!' }});
        return;
    } else {
      let userAut = rows[0];
      delete (userAut.passWord);
      req.session.user = userAut;
      res.status(200).json (rows);
    }
  })
})

Global.router.post ('/register' , Global.form.single() ,function (req , res , next) {
  let username = req.body.username;
  let password = req.body.password;
  let fullname = req.body.fullname;
  let email    = req.body.email;

  let newUser = {
    userName : username,
    passWord : Global.md5(password + Global.keyMd5),
    fullName : fullname,
    email    : email
  };

  Global.rootPool.query ('SELECT `id` FROM `users` WHERE ' +
  ' `userName` = ? or `email` = ?' , [username,email] ,
  function ( err , rows , fields) {
    if (rows.length > 0) {
        res.status(400).json ({err : {msg : 'This account or email have been used.'}});
        return;
    } else {
        Global.rootPool.query ('INSERT INTO `users` SET ?' , newUser ,
        function (err , rows , fields) {
          if (err) {
            console.log(err);
            console.log(newUser);
            res.status(400).json ( {err : {
              msg : 'Your account is not created due to an unknown reason!',
              act : 'Please try again.'
            } } )
          }
          else {
            delete (newUser.passWord);
            req.session.user = newUser;
            res.status(200).json ({OK : {msg : newUser}});
          }
        })
    }
  })
})

Global.router.get ('/logout' , function (req, res, next) {
    delete (req.session.user);
    res.status (200).json ({OK : {msg : 'You have logged out!'}});
});

// Global.connection.connect();
module.exports = Global.router;
