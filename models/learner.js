var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOneOrCreate = require('mongoose-find-one-or-create');
var Grid = require("gridfs-stream");
var User = require('./user');

var fs = require("fs");
var gfs;

var learnerSchema = new Schema({


	profileImageId:String,
	admNo:String,
	userId: String,
	personId: String,
	schoolId: String,
	grades: [{id:String,active:false,subjects:[{id:String}],_id:false}],
	results: [{id:String,_id:false}],
	sponsors:[{id:String,reaction:String,_id:false}],
	aspirations: [{id:String,_id:false,choice:String}],
	activities: [{id:String,_id:false}],
	questions: [{id:String,seen:Boolean,answers:[{id:String,seen:Boolean}]}], 
	isDeleted: Boolean

	
},
{
	timestamps: true
});





learnerSchema.plugin(findOneOrCreate);

var Learner = module.exports = mongoose.model('Learner',learnerSchema);

module.exports.create = function(learner,callback){

	learner.save(callback);
}

module.exports.reaction = function(sponsor,callback){

	
	var query = { "_id": sponsor.learnerId, "sponsors.id": sponsor.id };
	var update = { $set:{"sponsors.$.reaction":sponsor.reaction} };

	Learner.update(query,update,function(err,recFound){

		if(recFound.nModified === 0){

			query = { "_id": sponsor.learnerId};
			update = {$push:{"sponsors": {"id":sponsor.id,"reaction":sponsor.reaction} } }

			Learner.update(query,update, function(err, results) {

			if(err){
		
			callback(err,null);
				  }else{
			callback(null,results);
				  }


			});

		}else{

			if(err) callback(err,null);
			callback(null,sponsor)
		}


			
	})

	



	


}

module.exports.getLearnerId = function(admNo,callback){

	Learner.find(admNo, function(err, results) {
		if(err){
			callback(err,null)
		}else{
			callback(null,results[0].id)
		}
	});
	
}

module.exports.getDetails = function(userId,callback){

	Learner.findOne({'userId':userId,'isDeleted':false})
	.exec(function(err,learner){

		if(err){

			callback(err,null)
		}else{

			
			callback(null,learner)
			
		}

	})
	
}

module.exports.getAll = function(field,id,callback){

	var query;

	switch(field){

		case 'school':
		  query = {'schoolId':id,'isDeleted':false};
		break;

		case 'grade':
		  query = {'grade.id':id};
		break;

		case 'aspirations':
		  query = {'id':id};
		break;

		case 'default':
			query = {};
		break;

	}

	Learner.find(query, function(err, learners) {

		if(err){
			callback(err,null)
		}else{
			callback(null,learners)
		}
	});


	
}



module.exports.getResultsByGrade = function(gradeId,callback){

	Learner.findOne({'grades._id':gradeId})
	.exec(function(err,results){

		if(err){

			callback(err,null)
		}else{

			
			callback(null,results)
			
		}

	})
	
}

module.exports.registerLearner = function(learner,callback){



	Learner.findById(learner.id, function(err, learnerInfo) {


	learnerInfo.password = learner.password;
	learnerInfo.isRegistered = true;
	
	
	learnerInfo.save(function (err, results) {
	    if (err) return handleError(err);
	    callback(null,results);
	  });


	});
	
}


module.exports.addGrade = function(gradeId,callback){

	Learner.findById(learnerId)
	.select('sponsors')
	.exec(function(err,sponsors){

		

		if(err){

			callback(err,null)
		}else{

			callback(null,sponsors)
		}


	})

}

module.exports.addResults = function(resultsInfo,callback){

	Learner.findOne({'admNo':resultsInfo.adminNo}, function(err, learner) {

		learner.results.push(resultsInfo.resultsId);

		learner.save(function (err, results) {
		    if (err) return handleError(err);
		    callback(null,results);
		  });

	});


}


module.exports.addSubjects = function(subjectsInfo,callback){

	Learner.findOne({'admNo':subjectsInfo.adminNo}, function(err, learner) {

		learner.subjects = subjectsInfo.subjects;

		learner.save(function (err, results) {
		    if (err) return handleError(err);
		    callback(null,results);
		  });

	});
}


module.exports.getSponsors = function(learnerId,callback){

	Learner.findById(learnerId)
	.select('sponsors')
	.exec(function(err,sponsors){

		

		if(err){

			callback(err,null)
		}else{

			callback(null,sponsors)
		}


	})

}


module.exports.saveLearnerResults = function(learner,callback){

 	var query = {"_id":learner.id, "grade.id":learner.gradeId};
	var update = {$push: {"grade.results": {$each:learner.results}}};
	

	Learner.update(query,update, function(err, results) {

		if(err) callback(err,null)

		callback(null,results);
	});
	
}


module.exports.exists = function(admNo,callback){


	Learner.findOne({'admNo':admNo}, function(err, results) {
		if(err){
			callback(err,null);
		}else{

			callback(null,results);
		}
	});
	
}


module.exports.createUpdateLearner = function(user,learner,callback){
						

	if(learner.results[0].termId == 1){

			this.exists(learner.admNo,function(err,results){

				if(err) throw err;

				if(results == null){

						
					User.create(user,function(err,newUser){

						
							learner.userId = newUser._id;

							Learner.findOneOrCreate({admNo:learner.admNo}, learner, function(err, results) {
	    
							    if(err){
							    	callback(err,null)
							    }else{
							    	callback(null,results)
							    }
							    
							});

						})
					}else{

						Learner.findOneOrCreate({admNo:learner.admNo}, learner, function(err, results) {
	    
							    if(err){
							    	callback(err,null)
							    }else{
							    	callback(null,results)
							    }
							    
							});
					}
			})

			

	}else{

		getLearnerId(learner.admNo,function(err,learnerId){

			if(err){
				callback(err,null)
			}else{
				
				saveLearnerResults(learnerId,function(err,results){

					if(err){
						callback(err,null)
					}else{
						callback(null,results)
					}
				});


			}

		})
		
	}
	

}








module.exports.notifyLearners = function(type,notification,callback){




	switch(type){

		case 'question':

			var query = {"results.gradeId":notification.grade, "results.subjects.subjectId":notification.subjectId};
			var update = {$push: {"questions":{questionId:notification._id,seen:false}}};
			var options = {multi:true,safe: true, upsert: true, new : true};

		break;

		case 'answer':

		

			var query = {"questions.questionId":notification.questionId};
			var update = {$push: {"questions.answers":{answerId:mongoose.Types.ObjectId(notification._id),seen:false}}};
			var options = {multi:true,safe: true, upsert: true, new : true};


		break;
	}
	
	

	Learner.update(query, update, options, updatedRecords);

	function updatedRecords (err, numAffected) {
	  if(err){

	  	callback(err,null);
	  }else{

	  	callback(null,numAffected);
	  }
	}


}




