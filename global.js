'use strict'
//Dependencies
    const express           = require('express');
    const multer            = require('multer');
    const bodyParser        = require('body-parser');
    const mysql             = require('mysql');
    const session           = require ('express-session');
    const md5               = require ('md5');
    const fs                = require ('fs')

//Global require
    exports.multer          = multer;
    exports.fs              = fs;
//Global Const
    exports.insertLocation  = 'includes:'; // in file index.html.md
    exports.mainHTML        =  '../doc/source/index.html.md';
    exports.includeFiles    =  '../doc/source/includes/';
    exports.keyAut          = 'hunghoclamweb';
    exports.keyMd5          = 'hunghoclamweb';
//Method
    exports.md5             = md5;
    exports.express         = express;
    exports.router          = express.Router();
    exports.app             = express();
    exports.form            = multer() ;
    exports.bodyParser      = bodyParser;
    exports.session         = session;
    exports.rootConnection  = mysql.createConnection({
          host     : 'localhost',
          port     :  '6969',
          user     :  'sirhung1993',
          password : 'sephung',
          database : 'invoicesharing'
        });
    exports.rootPool  = mysql.createPool({
              connectLimit : 10,
              host     : 'localhost',
              port     :  '6969',
              user     : 'sirhung1993',
              password : 'sephung',
              database : 'invoicesharing'
            });
