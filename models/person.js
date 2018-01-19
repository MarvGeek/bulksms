var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Address = require('./address');
var Contact = require('./contact');

var personSchema = new Schema({
	
	gender: String,
	title: String,
	name: {first: String,last: String, preffered:String},
	contactId: String,
	addressId: String,

});


var Person = module.exports = mongoose.model('Person',personSchema);

module.exports.create = function(person,callback){



	var newPerson = new Person({
		name: person
	});

	


	newPerson.save(function(err,results){

		if(err)callback(err,null);

		callback(null,results);	

	
	});
}

module.exports.getDetails = function(id,callback){

	var results = {};

	Person.findById(id,function(err,person){

		if(err){
			callback(err,null)
		}else{

			results.id = person.id;
			results.gender = person.gender;
			results.title = person.title;
			results.name = {
							  first:person.name.first,
							  last:person.name.last,
							  preffered:person.name.preffered
							};
			
			callback(null,results);
			
			
		}
	});
	
}

module.exports.edit = function(field,person,callback){


	Person.findById(person.personId,function(err,doc){

		if(err) callback(err,null);

		switch(field){

			case "all":
				doc.gender = person.gender;
				doc.title = person.title;
				doc.name.first = person.name[0];
				doc.name.last = person.name[1];
			break;

			case "name":
				doc.name.first = person.name.first;
				doc.name.last = person.name.last;
			break;

			
		}
		
		doc.save(function(err,results){

			if(err) callback(err,null);

			callback(null,results)
		})
		
	})


}

module.exports.removePeople = function(people,callback){

	var query = {_id:{$in:people}};

	Person.remove(query,function(err,results){

		if(err) callback(err,null);

		callback(null,results)
	})


	
}


