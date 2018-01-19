var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({


	name:String,
	content: String

});


var Message = module.exports = mongoose.model('Message',messageSchema);

module.exports.createMessage = function(message,callback){

	if(err){
		callback(err,null);
	}else{

		callback(null,results);
	} 
}




module.exports.getAll = function(schoolId,callback){

	Message.find(sch)
	.exec(function(err,messages){
		if(err){
			callback(err,null)
		}else{
			callback(null,messages)
		}


	})
}