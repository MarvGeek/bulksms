var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Area = require('./area');

var addressSchema = new Schema({

	line1: String,
	line2: String,
	areaId:String,
	
});


var Address = module.exports = mongoose.model('Address',addressSchema);

module.exports.create = function(address,callback){

	address.save(function(err,results){

		if(err){

			callback(err,null)
		}else{

			
			callback(null,results);

		}

		
	});
}



module.exports.getDetails = function(id,callback){


	var results = {};

	Address.findById(id, function(err, address) {

		if (err) return handleError(err);

		results.id = address.id;
		results.line1 = address.line1;
		results.line2 = address.line2;

		if(address.areaId != null){

			Area.getDetails(address.areaId,function(err,area){

				if(err) throw err;

				results.area = area;
				callback(null,results);
			})

		}else{
			callback(null,results);
		}
	    

	});
	
}




module.exports.update = function(address,callback){



	var query = {"_id": address.id};
	var update = { $set: { areaId: address.areaId,line1: address.line1,line2: address.line2}};

	Address.updateOne(query,update)
	.then(function(result) {
	  callback(result)
	}) 

	

}
