var express = require('express');
var router = express.Router();
var multer = require("multer");
var nodeMailer = require('nodemailer');
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







router.post('/send',function(req,res){

	var results = {sent:false};
	var message = "";
	var subject = "";




	let transporter = nodeMailer.createTransport({
		host: 'smtp.gmail.com',
	    port: 465,
	    secure: true, // use SSL
		auth: {
		        user: 'marvinranyaole@gmail.com',
		        pass: 'tbgeek1603'
		    }
	});

	if(req.body.type === 'invoice'){

		subject = 'School Bulk SMS Invoice';
		message = 'Hi ' + req.body.name+", Please accept the attched as the invoice for "+
	  		 req.body.credits+ " sms credits you have requested.I hope you will find everything in order.\n"+"Kind Regards\n"+
	  		 "Marvin Ranyaole\n"+
	  		 "065 996 3717\n"+
	  		 "079 247 3638";

		var invoice = require('../models/invoice').create(req.body);
		var path = 'schools/'+req.body.name+'/Invoices/'+fileName;

		prepareInvoice(invoice,req.body);

	    invoice.pipe(fs.createWriteStream(path));
	    invoice.end();

	    let mailOptions = {
		  from: 'marvin@eazydatasolutions.co.za',
		  to: 'marvin@eazydatasolutions.co.za',
		  subject: subject,
		  text: message,
		};


		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    res.json({sent:false,message:"Error When Trying To Send Login Details, Please Contact Support"});
		  } else {
		  	res.json({sent:true,message:"Login Details Sent To: " + req.body.email});
		  }

		});

	}


	if(req.body.type === 'credentials'){


		Contact.exists(req.body.email,function(err,results){

			if(err) throw err;


			if(results !== null){

				if(results.email1 === req.body.email){

					Contact.getDetailsByEmail(req.body.email,function(err,contactDetails){

						School.getUserByContactId(contactDetails._id,function(err,school){

							User.getDetailsById(school.userId,function(err,userDetails){


								subject = 'School Bulk SMS Login Details';
								message = 'Hi ' + school.name+", Your  School Bulk SMS Login Details\n "+
						  		 "Username: "+school.name+"\n"+
						  		 "Password: "+userDetails.password+"\n"+"Kind Regards\n"+
						  		 "Marvin Ranyaole\n"+
						  		 "065 996 3717\n"+
						  		 "079 247 3638";

						  		 let mailOptions = {
								  from: 'marvin@eazydatasolutions.co.za',
								  to: req.body.email,
								  subject: subject,
								  text: message,
								  attachments: [{path: path}]
								};


								transporter.sendMail(mailOptions, function(error, info){
								  if (error) {
								    res.json({sent:false,message:"Error When Trying To Send Login Details, Please Contact Support"});
								  } else {
								  	res.json({sent:true,message:"Login Details Sent To: " + req.body.email});
								   
								  }
								});
							})
						  })
						})

				}else{

					res.json({sent:false,message:"Email: " + req.body.email + " was not found, please contact support for further assistance"});
				}


			}else{

				res.json({sent:false,message:"Email: " + req.body.email + " was not found, please contact support for further assistance"});
			}
		})
	}

	
	
	

});


 function prepareInvoice(invoice,data){

	var date = new Date();
	var today = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString();
	var fileName = 'inv_'+ today;


    invoice.fontSize(12)
    .text('Bill To: ' +req.body.name, 100, 250);
    invoice
    .text('Date: ' +date.getDate().toString()+'-'+date.getMonth().toString()+'-'+date.getFullYear().toString(), 100, 260);
    
    invoice
    .text('Bank: FNB', 370, 250)
    invoice
    .text('Acc Name: Eazy Data Solutions', 370, 260)
    invoice
    .text('Acc Number: 62349943002', 370, 270)

    

}












module.exports = router;