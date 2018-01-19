var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Person = require('./person');

var stakeholderSchema = new Schema({

	schoolId: String,
	personId:String,
	contacts:Array,
	groups:Array,
	class:String,
	isDeleted:false,
	
},
{
	timestamp:true
});

var Stakeholder = module.exports = mongoose.model('Stakeholder',stakeholderSchema);

module.exports.create = function(stakeholder,personId,callback){

	newStakeholder = new Stakeholder({

		personId: personId,
		schoolId: stakeholder.schoolId,
		contacts: stakeholder.contacts,
		groups: stakeholder.groups
	})



	newStakeholder.save(function(err,results){

		if(err)callback(err,null);
		callback(null,results);
				
	});
}

module.exports.getAll = function(schoolId,callback){

	var  query = {'schoolId':schoolId};

	Stakeholder.find(query, function(err, stakeholders) {

		if(err){
			callback(err,null)
		}else{
			callback(null,stakeholders)
		}
	});


	

}


module.exports.addGroup = function(details,callback){


	Stakeholder.findById(details.stakeholderId,function(err,stakeholder){

		if(err) callback(err,null);

		var exists = false;

		for(var i=0; i<stakeholder.groups.length; i++){

			if(stakeholder.groups[i] === details.name){
				found = true;
				i = stakeholder.groups.length;
			}
		}

		if(!exists){

			stakeholder.groups.push(details.name);

			stakeholder.save(function(err,results){

				if(err) callback(err,null);

				callback(null,exists)

			})

		}else{

			callback(null,exists)
		}


	})
	

}


module.exports.getDetails = function(id,callback){

	Stakeholder.findById(id, function(err, stakeholder) {

		if(err) callback(err,null);
		callback(null,stakeholder)
	});

	
}




module.exports.edit = function(field,stakeholder,callback){


	Stakeholder.findById(stakeholder.id,function(err,doc){

		if(err) callback(err,null);

		switch(field){

			case "all":
				doc.personId = stakeholder.personId;
				doc.contacts = stakeholder.contacts;
				doc.groups = stakeholder.groups;
			break;

			case "contacts":
				doc.contacts = stakeholder.contacts;
			break;

			case "groups":
				doc.groups = stakeholder.groups;
			break;
		}
		
		doc.save(function(err,results){

			if(err) callback(err,null);

			callback(null,results)
		})
		
	})


}

module.exports.removeStakeholders = function(stakeholders,callback){



	Stakeholder.find({groups:{$in:stakeholders}},function(err,stakeholders){

		if(err) callback(err,null);

	})



	
}

module.exports.removeStakeholderByGroup = function(i,group,callback){





	Stakeholder.find({ 'groups': group },function(err, results){

		if(err) callback(err,null);
		console.log(results)
		if(i<results.length){

			if(results[i].groups.length === 1){

				Stakeholder.remove([results[i]._id],function(err,rmvStakeholder){

					if(err) callback(err,null);


					Person.remove([results[i].personId],function(err,rmvPerson){

						if(err) callback(err,null);

						i++;
						module.exports.removeStakeholderByGroup(i,group,callback)

					})

				})

			}else{

				results[i].groups.pull(group);

				results[i].save(function(err,rmvStakeholder){

					if(err) callback(err,null);

					i++;

					module.exports.removeStakeholderByGroup(i,group,callback)

				})


			}

		}else{

			callback(null,results)
		}
		
		

	})
	


	
}


module.exports.getByGroups = function(groups,callback){


	Stakeholder.find({ 'groups': { $in: groups } },function(err, results){

		if(err) callback(err,null);
	
		callback(null,results)

	})
	


	
}










