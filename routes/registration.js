var express = require('express');

var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');


var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");


var router = express.Router();
var socket = require('../socket').io();

var Person = require('../models/person');
var Address = require('../models/address');
var Contact = require('../models/contact');
var User = require('../models/user');
var Stakeholder = require('../models/stakeholder');
var School = require('../models/school');

var dataSet = [];




var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});


var upload = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
            }).single('file');




var info = {};
var grade;
var learnersDetails = [];
var stakeholders = [];

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});





router.post('/registration',function(req,res){

    var results = {isRegistered: false}


    Contact.exists(req.body.contact.email,function(err,exists){

      if(exists == null){

        var user = new User();

        user.name = req.body.user.name;
        user.password = req.body.user.password;
        user.isRegistered = true;

        User.create(user,function(err,newUser){

          if(err) throw err;

          var contact = new Contact();

          contact.email1 = req.body.contact.email;
          Contact.create(contact, function(err,newContact){

            if(err) throw err;

            var school = new School();

            school.userId = newUser._id;
            school.contactId = newContact._id;
            school.name = req.body.school.name;
            school.type = req.body.school.type;

            School.create(school, function(err,newSchool){

              if(err) throw err;

               results.isRegistered = true;
               results.userId = newUser._id;
               results.schoolId = newSchool._id;

               res.json(results);
            })

          })
        })

      }else{

        return send.json(results);
      }

    })

    

});


module.exports = router;