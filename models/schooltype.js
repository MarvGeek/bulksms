var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schoolTypeSchema = new Schema({

	name:String,
	grades:Array,
	
	
})

var SchoolType = module.exports = mongoose.model('SchoolType',schoolTypeSchema);



module.exports.getAll = function(callback){

	
	SchoolType.find(function(err,results){

		if(err) callback(err,null);

		callback(null,results);
	})
}

module.exports.get = function(id,callback){

	
	SchoolType.findById(id,function(err,results){

		if(err) callback(err,null);

		callback(null,results);
	})
}

module.exports.getName = function(id,callback){

	
	SchoolType.findOne({'_id':id},function(err,results){

		if(err) callback(err,null);

		callback(null,results);
	})
}

module.exports.getIdByName = function(name,callback){

	
	SchoolType.findOne({"name":name},'_id',function(err,results){

		if(err) callback(err,null);

		callback(null,results);
	})
}


module.exports.getGrades = function(schoolType,callback){

	
	SchoolType.findOne({'name':schoolType},'grades',function(err,results){

		if(err) callback(err,null);
		callback(null,results);
	})
}







