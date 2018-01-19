var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	
	
	name:String,
	password: String,
	token: String,
	isRegistered : Boolean,
	isDeleted: Boolean,
	type: String,

},
{
	timestamps: true
}

);




var User = module.exports = mongoose.model('User',userSchema);


module.exports.exists = function(username,callback){

	User.findOne({'name':username}, function(err, results) {
		if(err){
			callback(err,null)
		}else{

		
			callback(null,results)
		}
	});
}


module.exports.create = function(data,callback){

	var user = User({
		
		name: data.name,
		password: data.password,
		isRegistered: true,
	})

	user.save(function(err,results){

		if(err){
			callback(err,null)
		}else{
			callback(null,results)
		}

		
	});
}


module.exports.createPassword = function(user,callback){


	User.findOne({'name':user.name}, function(err, userInfo) {


		userInfo.password = user.password;
		userInfo.isRegistered = true;
		
		
		userInfo.save(function (err, results) {
		    if (err) return handleError(err);
		    callback(null,results);
		  });
	});
}




module.exports.getDetails = function(user,callback){


	User.findOne({'name':user.name,'password':user.password})
	.exec(function(err,results){
		if(err){
			callback(err,null)
		}else{

			callback(null,results)
		}

	})

}

module.exports.getDetailsById = function(id,callback){



	User.findById(id, function(err, user) {

		if (err) return handleError(err);
	    callback(null,user);

	});
	
}

module.exports.updateToken = function(id,token,callback){


	var query = {_id: id};
	var update = { $set: { token: token }};

	User.updateOne(query,update)
	.then(function(result) {
	  callback(null,result)
	}) 
}

module.exports.update = function(user,callback){


	
	var query = {_id: user.id};
	var update = { $set: { name: user.name, password: user.password }};

	User.updateOne(query,update)
	.then(function(result) {
	  callback(result)
	}) 
}

