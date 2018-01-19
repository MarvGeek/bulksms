var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var relationshipSchema = new Schema({

	name:String,

},
{
	timestamp:true
});



var Relationship = module.exports = mongoose.model('Relationship',relationshipSchema);

module.exports.getIdByName = function(relationship,callback){

 Relationship.findOne({'name':relationship})
	.select('_id')
	.exec(function(err,results){

		if(err){

			callback(err,null);
		}else{

			callback(null,results);
		}


  });

}
