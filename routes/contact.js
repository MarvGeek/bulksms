var express = require('express');
var router = express.Router();
var multer = require("multer");
var fs = require('fs');
var path = require('path');

var Contact = require('../models/contact');
var User = require('../models/user');
var School = require('../models/school');





router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



router.post('/contact',function(req,res){

	var results = {exists:true};

	Contact.exists(req.body.email,function(err,contactResults){

	if(contactResults == null){

		results.exists = false;

		var contact = new Contact();

		contact.email1 = req.body.email;

	
		Contact.create(contact,function(err,newContact){

			if(err) throw err;

			return res.json(results); 

		})


	}else{

		return res.json(results);
	}

});

});



router.get('/contact/:id',function(req,res){



	Contact.getDetails(req.params.id,function(err,contact){

		if(err) throw err
	
		res.json(contact);

	});

});












module.exports = router;