var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var groupSchema = new Schema({

	name:{
		type: String
	}
	
})

var Group = module.exports = mongoose.model('Group',groupSchema);

module.exports.add = function(group,callback){

	group.save(callback);
}

module.exports.getAll = function(callback){

	Group.find({})
	.exec(function(err,groups){

		
		if(err){

			callback(err,null)
		}else{

			callback(null,groups)
		}


	})

}