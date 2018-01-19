var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var contactSchema = new Schema({
	
	
	cell1:String,
	cell2:String,
	email1:String,
	email2:String,
	home:String,
	work:String,
	website: String,
	fax: String,
	facebook:String,
	twitter:String,
	instgram: String,

});


var Contact = module.exports = mongoose.model('Contact',contactSchema);



module.exports.create = function(data,callback){

	var contact = new Contact({
		email1: data.email,
	})
	contact.save(function(err,results){

		if(err){

			callback(err,null)
		}else{

			
			callback(null,results);

		}

		
	});
}

module.exports.exists = function(email,callback){

	Contact.findOne({'email1':email}, function(err, results) {
		if(err){
			callback(err,null)
		}else{

		
			callback(null,results)
		}
	});
}

module.exports.getDetails = function(id,callback){




	Contact.findById(id, function(err, contact) {

		if (err) callback(err,null);

	    callback(null,contact);

	});
	
}

module.exports.getDetailsByEmail = function(email,callback){




	Contact.findOne({'email1':email}, function(err, contact) {

		if (err) callback(err,null);

	    callback(null,contact);

	});
	
}

module.exports.updateEmail = function(contactId,email,callback){


	
	var query = {_id: contactId};
	var update = { $set: { email2: email }};

	Contact.updateOne(query,update)
	.then(function(result) {
	  callback(null,result)
	}) 
}

module.exports.update = function(contact,callback){

	var query = {_id: contact.id};
	var update = { $set: { cell1: contact.cell, email1: contact.email}};

	Contact.updateOne(query,update)
	.then(function(result) {
	  callback(result)
	}) 

	

}
