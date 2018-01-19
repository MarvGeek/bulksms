var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var multer = require("multer");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var User = require('../models/user');
var Person = require('../models/person');
var Contact = require('../models/contact');
var Stakeholder = require('../models/stakeholder');
var School = require('../models/school');
var Group = require('../models/group');
var Grade = require('../models/grade');
var stakeholders = [];
var stakeholdersData = [];



router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.post('/user', function (req, res){


	var results = {exists:false};
    

	User.exists(req.body.name,function(err,userResults){

	
		if(err) throw err;
		
		if(userResults === null){

			var user = new User();

			user.name = req.body.name;
			user.password = req.body.password;
			user.type = req.body.stakeholders;
			user.isRegistered = true;

			User.create(user,function(err,newUser){

				if(err) throw err;
				
				return res.json(newUser);
			});
			

					
		}else{

			return res.json(results);
		}


	})

})









router.get('/',function(req,res){

	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<h1>You have visited server default page!</h1>');
	res.end();

});

router.post('/',function(req,res){

	res.write('<h1>You have visited server default page!</h1>');

});

router.get('/:username',function(req,res){


	var user = {};
	user.exists = false;

	User.exists(req.params.username,function(err,results){

		if(err) throw err;

		if(results != null){
			
			user.exists = true;
			user.isRegistered = results.isRegistered;
			user.name = results.name;
			user.password = results.password;
			user.type = results.type;
		
			return res.json(user);

		}else{

			return res.json(user);
		}

		

	})

	
});


router.post('/password',function(req,res){



  User.createPassword(req.body,function(err,results){

  		if(err) throw err;

  		return res.json(results);


  })

});



router.post('/login',function(req,res){


	
	var results = {success: false};


  	User.getDetails(req.body,function(err,user){

  		
  
		if(err) throw err

		if(user != null){

			results.id = user._id;
			results.isRegistered = user.isRegistered;
			results.name = req.body.name;
			results.token = user.token;
			results.success = true;
			
			return res.json(results);
			
		}else{

			return res.json(userInfo);
		}

		
	});

 
});


module.exports = router;