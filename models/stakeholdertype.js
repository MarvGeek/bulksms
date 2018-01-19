var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var stakeholderTypeSchema = new Schema({

	name:String
	
	
})

var StakeholderType = module.exports = mongoose.model('StakeholderType',stakeholderTypeSchema);



module.exports.getAll = function(callback){

	
	StakeholderType.find(function(err,results){

		if(err) callback(err,null);

		callback(null,results);
	})
}

module.exports.getNames = function(callback){

	
	StakeholderType.find('name',function(err,results){

		if(err) callback(err,null);

		callback(null,results);
	})
}

module.exports.get = function(id,callback){

	
	StakeholderType.findById(id,function(err,results){

		if(err) callback(err,null);

		callback(null,results);
	})
}

module.exports.getIdByName = function(name,callback){

	
	StakeholderType.findOne({"name":name},'_id',function(err,results){

		if(err) callback(err,null);

		callback(null,results);
	})
}










