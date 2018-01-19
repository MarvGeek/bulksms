var express = require('express');
var router = express.Router();
var multer = require("multer");
var fs = require('fs');
var path = require('path');


var School = require('../models/school');



var resultsDir = '';
var questionsDir = '';

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});







router.post('/message',function(req,res){


	School.addMessage(req.body.schoolId,req.body.message,function(err,messages){

		if(err) throw err
	
		res.json(messages);

	});

});








module.exports = router;