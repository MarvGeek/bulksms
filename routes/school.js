var express = require('express');
var router = express.Router();
var multer = require("multer");
var fs = require('fs');
var path = require('path');


var User = require('../models/user');
var Contact = require('../models/contact');
var School = require('../models/school');
var SchoolType = require('../models/schooltype');



var schools = [];


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/schoolTypes',function(req,res){
 
  SchoolType.getAll(function(err,results){

  	if(err) throw err;

  	res.json(results);

  })
  
  
});

router.post('/school',function(req,res){


	var results = {success:false};



	if(req.body.id == ''){

		Contact.exists(req.body.email,function(err,exists){

			if(exists){
				results.message = "The email you provided is already in use. Login and click on Forgot Password to get your login details";
				res.json(results);
			}else{

				var user = new User();

				user.name = req.body.user.name;
				user.password = req.body.user.password;
				user.isRegistered = true;

				user.save(function(err,newUser){

					if(err){

						results.message = "Error occured when saving school registration(User) "+ err;
						res.json(results);
					}

					var contact = new Contact();

					contact.email1 = req.body.contact.email;

					contact.save(function(err,newContact){
			

						if(err){

							user.findByIdAndRemove(user._id,function(err,userRemoved){

								results.message = "Error occured when saving school registration(Contact) "+ err;
								res.json(results);
							})

							
						}

						var school = new School();

						school.name = req.body.name;
						school.typeId =  req.body.typeId;
						school.userId = newUser._id;
						school.contactId = newContact._id;
						
						
						
						

						school.save(function(err,newSchool){

							if(err){

								user.findByIdAndRemove(newUser._id,function(err,userRemoved){

									if(err){

										results.message = "Error occured when saving school registration(School.User) "+ err;
										res.json(results);

									}

									contact.findByIdAndRemove(newContact._id,function(err,contactRemoved){

										if(err){

											results.message = "Error occured when saving school registration(School.Contact) "+ err;
											res.json(results);

										}

										results.message = "Error occured when saving school registration(School) "+ err;
										res.json(results);

									})

								})
							}

							SchoolType.get(newSchool.typeId,function(err,schooltype){

								results.success = true;
								results.userId = newUser._id;
								results.isRegistered = newUser.isRegistered;
								results.schoolId = newSchool._id;
								results.grades = schooltype.grades;
								results.message = newSchool.name + " " + req.body.type + " is successfully registered";
								res.json(results);

							})
							
						})

					})
				})

			}
		})

	}else{

		if(req.body.userType === 'Admin'){

			School.getDetailsById(req.body.id,function(err,school){

				if(err){
					results.message = "Error occured when trying to update (School) the email " + err;
					res.json(results);
				}

				if(req.body.email != ""){

				   Contact.updateEmail(school.contactId,req.body.email,function(err,upEmail){

				   		if(err){
				   			results.message = "Error occured when trying to update (Contact) the email " + err;
				   			res.json(results);
				   		}

						results.success = true;
						results.name = req.body.name;
						results.message = "School email 2 is successfully updated";
						results.id = school._id;
						results.email = req.body.email;

						if(req.body.token)
							results.token = req.body.token;
						else
							results.token = "Enter token";


					
						res.json(results);

					})

				}

				if(req.body.token != ""){

					User.updateToken(school.userId,req.body.token,function(err,upUser){

						if(err){
				   			results.message = "Error occured when trying to update (Contact) the email " + err;
				   			res.json(results);
				   		}

						results.success = true;
						results.name = req.body.name
						results.message = "School token is successfully updated";
						results.id = school._id;
						results.token = req.body.token;
						if(req.body.email)
							results.email = req.body.email;
						else
							results.email = "Enter email";
						

						res.json(results);

					})

				}
				
			})
			

			
		}else{

		}

		
	}
	

});




router.get('/school/:id',function(req,res){

	var results = {success:false}

	School.getDetails(req.params.id,function(err,school){

		if(err) throw err
		
		results.id = school._id;
		results.name = school.name;
		results.userId = school.userId;
		results.contactId = school.contactId;

		SchoolType.get(school.typeId,function(err,type){

			if(err){

				results.message = "Error when fetching school type";
				res.json(results);
			}



			results.type = type.name;
			results.grades = type.grades;
			results.groups = school.groups
			res.json(results);


			

		})


	});

});

router.post('/group',function(req,res){

  var results = {success: false};

 

    School.addGroup(req.body, function(err,newGroup){

      if(err){
        results.message = "Error saving group name " + err;
        return res.json(results);
      }


      if(newGroup){
      	results.message = "Group name already exists";
      	return res.json(results);
      }else{
      	results.success = true;
      	results.message = "Group name is successfully saved";

      	return res.json(results);
      }

      
      

  })

});

router.get('/schools',function(req,res){



  if(schools.length == 0){

    School.getAll(function(err,schoolsResults){

      if(err) throw err;
   	  populateSchools(0,schoolsResults,function(err){

   	  	if(err) throw err;

   	  	return res.json(schools);
   	  })


    });

    }else{

        return res.json(schools); 
    }

});

function populateSchools(i,list,cb){

	if(i < list.length){

		Contact.getDetails(list[i].contactId, function(err,contact){

			if(err) throw err;

			User.getDetailsById(list[i].userId, function(err,user){

				if(err) throw err;

				var school = {};
				school.id = list[i].id;

				SchoolType.get(list[i].typeId,function(err,schoolType){

					if(err) throw err;

					school.name = list[i].name + " " + schoolType.name.charAt(0).toUpperCase() + schoolType.name.slice(1);

					if(contact.email2 != undefined)
						school.email = contact.email2;
					else
						school.email = "Provide email"

					if(user.token != undefined)
						school.token = user.token;
					else
						school.token = "Provide token"

					schools.push(school);

					populateSchools(i+1,list,cb);

				})
				
				

			})
		})
	}else{

		return cb(null)
	}
}








module.exports = router;