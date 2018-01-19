var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var areaSchema = new Schema({
	
	
	name:String,
	location:String,
	postalCode:String,
	

});

var Area = module.exports = mongoose.model('Area',areaSchema);

module.exports.create = function(area,callback){

	area.save(function(err,results){

		if(err){

			callback(err,null)
		}else{

			
			callback(null,results);

		}

		
	});
}

module.exports.getDetails = function(id,callback){



	Area.findById(id, function(err, area) {

		if (err) return handleError(err);

		
	    callback(null,area);

	});
	
}

module.exports.getDetailsByName = function(areaName,callback){




	Area.findOne({'name':areaName})
	.exec(function(err,area){

		if(err){

			callback(err,null)
		}else{

			
			callback(null,area)
			
		}

	})
	
}

module.exports.getAll = function(callback){


	Area.find({}, function(err, areas) {

		if(err){
			callback(err,null)
		}else{
			callback(null,areas)
		}
	});


	
}

