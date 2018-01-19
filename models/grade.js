var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var gradeSchema = new Schema({

	name:String,

},
{
	timestamp:true
});



var Grade = module.exports = mongoose.model('Grade',gradeSchema);

module.exports.getIdByName = function(gradeName,callback){

 Grade.findOne({'name':gradeName})
	.select('_id')
	.exec(function(err,results){

		if(err){

			callback(err,null);
		}else{

			callback(null,results);
		}


  });

}


module.exports.getAll = function(callback){


	Grade.find({}, function(err, grades) {

		if(err){
			callback(err,null)
		}else{
			callback(null,grades)
		}
	});


	
}
