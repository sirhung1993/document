'use strict'

const Global = require ('../global.js');

Global.router.use(Global.session({
    secret: Global.keyAut,
    resave: false,
    saveUninitialized: true
}));

// let form = Global.multer ( { dest : '../doc/source/includes' });

Global.router.use(Global.bodyParser.urlencoded({
                                    extended: false,
                                    inflate: true }))
// parse application/json
Global.router.use(Global.bodyParser.json())

Global.router.post ('/' , Global.form.single('insertFile') ,
function ( req , res , next) {
    if (req.file) {

        let destNameFile    =   req.file.originalname;
        // fs.stat is not recommended
        Global.fs.stat (Global.includeFiles + destNameFile,
        function ( isNewFile , stats) {
            if (isNewFile) {
                Global.fs.writeFile (Global.includeFiles + destNameFile ,
                req.file.buffer , function (err) {
                    if (err) {
                        res.status(400).send ({err : { msg : 'Cannot stored the file.'}});
                    } else {
                        //modify HTML file here
                        let updatedData = Global.fs.readFileSync (Global.mainHTML, 'utf8');

                        updatedData = updatedData.split('\n');

                        for (var i = 0; i < updatedData.length; i++) {
                            if (updatedData[i] == Global.insertLocation) {
                                updatedData.splice (++i , 0 , '  - ' +
                                destNameFile);
                            }
                        }
                        updatedData = updatedData.join('\n');
                        //
                        Global.fs.writeFileSync (Global.mainHTML , updatedData);
                        console.log('update done');
                        res.status(200).send ({OK :
                            { msg : 'The inserted file is store correctly' }});
                    }
                });

            } else {
                res.status(403).send ({err : { msg : 'The file name is duplicataed!' }})
            }
        })
    } else {
        res.status(400).send ({err :
            { msg : 'There is no attached file'}
        })
    }
})

Global.router.put ('/modify' , function ( req , res , next) {
    // function modifyHTML (callback) {
    //     Global.fs.readFileSync (Global.mainHTML, function (err , data) {
    //         callback (null , data);
    //     })
    // };
    // modifyHTML (function (err , data) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(data);
    // })
    let data = Global.fs.readFileSync (Global.mainHTML, 'utf8');

    data = data.split('\n')

    for (var i = 0; i < data.length; i++) {
        if (data[i] == Global.insertLocation) {
            data.splice (++i , 0 , '  - test');
        }
    }
        console.log(data.join('\n'));
})

module.exports = Global.router;
