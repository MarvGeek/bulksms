var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schoolSchema = new Schema({

	name:String,
	typeId:String,
	contactId:String,
	userId:String,
	messages:Array,
	groups: Array,

	
})

var School = module.exports = mongoose.model('School',schoolSchema);

module.exports.create = function(school,callback){

	school.save(callback);
}

module.exports.getDetails = function(id,callback){

	
	School.findOne({'userId':id},function(err,school){

		if(err) callback(err,null);

		callback(null,school)
	})
	

}




module.exports.getUserByContactId = function(contactId,callback){

	
	School.findOne({'contactId':contactId},function(err,contact){

		if(err) throw callback(err,null);
		callback(null,contact);

	})
	

}

module.exports.getDetailsById = function(id,callback){

	
	School.findById(id)
	.exec(function(err,school){

		if(err){

			callback(err,null)
		}else{

			callback(null,school)
		}


	})

}

module.exports.getAll = function(callback){

	var  query = {};

	School.find(query, function(err, schools) {

		if(err){
			callback(err,null)
		}else{
			callback(null,schools)
		}
	});


	
}

module.exports.addGroup = function(details,callback){


	School.findById(details.schoolId,function(err,school){

		if(err) callback(err,null);

		var exists = false;

		for(var i=0; i<school.groups.length; i++){

			if(school.groups[i] === details.name){
				found = true;
				i = school.groups.length;
			}
		}

		if(!exists){

			school.groups.push(details.name);

			school.save(function(err,results){

				if(err) callback(err,null);

				callback(null,exists)

			})

		}else{

			callback(null,exists)
		}


	})
	

}

module.exports.update = function(school,callback){


	
	var query = {_id: school.id};
	var update = { $set: { name: user.name, password: user.password }};

	User.updateOne(query,update)
	.then(function(result) {
	  callback(result)
	}) 
}

module.exports.addMessage = function(id,message,callback){

    School.findOne({'_id':id})
	.exec(function(err,school){

		if(err){

			callback(err,null)
		}else{
			school.messages.push(message);
			school.save(callback);
			
		}


	})
}

module.exports.getMessages = function(id,callback){

    School.findOne({'_id':id})
    .select('messages')
	.exec(function(err,messages){

		if(err){

			callback(err,null);
		}else{
			callback(null,messages);
			
		}


	})
}

