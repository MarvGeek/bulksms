var express = require('express');

var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');


var multer = require('multer');

var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");


var router = express.Router();
var socket = require('../socket').io();

var Person = require('../models/person');
var Address = require('../models/address');
var Contact = require('../models/contact');
var User = require('../models/user');
var Stakeholder = require('../models/stakeholder');
var StakeholderType = require('../models/stakeholdertype');
var SchoolType = require('../models/schooltype');
var School = require('../models/school');

var dataSet = {};
var excelDs = [];
var info = {};
var grade;
var learnersDetails = [];
var stakeholders = [];
var stakeholderTypes = [];
var grades = [];
var types = ['All','SGB','SMT','Educators','PS Staff','Parents'];

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.get('/stakeholderTypes',function(req,res){

  StakeholderType.getAll(function(err,results){

    return res.json(results);
  })
  
});




var storage = multer.diskStorage({ //multers disk storage settings

    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },

    filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});


var upload = multer({ 

    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }

  }).single('attachment');




router.post('/stakeholders', function(req, res) {

    stakeholders = [];
    var results = {process:false};

    var exceltojson; //Initialization
    upload(req,res,function(err){

        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }

        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1,err_desc:"No file passed"});
            return;
        }


        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {

          exceltojson = xlstojson;

        }

        try {

          exceltojson({
              input: req.file.path, //the same path where we uploaded our file
              output: null, //since we don't need output.json
              lowerCaseHeaders:true
          }, function(err,result){
              if(err) {
                  return res.json({error_code:1,err_desc:err, data: null});
              } 

              dataSet.schoolId = req.body.schoolId;
              dataSet.schoolType = req.body.schoolType;
              dataSet.type = req.body.stakeholdersType;
              dataSet.stakeholders = result;
              dataSet.targetStakeholders = req.body.stakeholders;
              dataSet.targetPeople = req.body.people;



              processStakeholders(function(err,processResults){

                if(err){
                  results.message = "Error occured when saving Stakeholders, Please Contact Support " + err;
                  res.json(results)
                }



                if(processResults.processed){

                  results.process = true;
                  results.stakeholders = stakeholders;
                  results.message = "Stakeholders were successfully uploaded";

                }else{


                  results.message = processResults.message;
              
                }
                
              
                res.json(results);

              })
              
          });

        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }

        
    })



});

function processStakeholders(callback){

    var results = {processed:false};
    var dsNumCol = Object.keys(dataSet.stakeholders[1]);



    if(dsNumCol.length === 14 || dsNumCol.length === 4){
   
      if(dataSet.stakeholders.length > 0 && dataSet.targetStakeholders != ''){
       
        Stakeholder.remove({_id:{$in:dataSet.targetStakeholders.split(",")}},function(err,rmvdStakeholders){

          if(err) callback(err,null);

          Person.remove({_id:{$in:dataSet.targetPeople.split(",")}},function(err,rmvdPeople){

            if(err) callback(err,null);

            saveStakeholders(0,function(err){

              if(err) callback(err,null)

              results.processed = true;
              callback(null,results)

            })

          })

        })
      }else{

          saveStakeholders(0,function(err){

            if(err) callback(err,null)

            results.processed = true;
            callback(null,results)

          })

      }



    }else{

      results.message = "Your data source is in an Incorrect Format, Please Contact Support";


      callback(null,results);
    }
   

   
}


function removeStakeholders(stakeholders,people,callback){

  Stakeholder.remove(stakeholders,function(err,rmvdStakeholders){

    if(err) callback(err);

    Person.remove(people,function(err,rmvdPeople){

      if(err) callback(err);

      saveStakeholders(0,function(err){

        if(err) callback(err);

        callback(null)

      })
      


    }) 


  })


}

router.post('/stakeholder',function(req,res){

  var results = {success: false};

  if(req.body.id === ''){

    Person.create(req.body.name, function(err,newPerson){

      if(err){
        results.message = "Error saving stakeholder(Personal Information): " + err;
        return res.json(results);
      }


      Stakeholder.create(req.body,newPerson._id,function(err,newStakeholder){

        if(err){
          results.message = "Error saving stakeholder information: " + err;
          return res.json(results);
        }

        results.success = true;
        results.message = "Stakeholder was successfully saved";
        return res.json(results);

      })

  })

  }else{

 
    if(req.body.name !== "" && req.body.target === 'name'){

      
        Person.edit("name",req.body,function(err,upPerson){

          if(err) throw err;
         
          results.success = true
          results.message = "Stakeholder's name was successfully updated";
          return res.json(results); 

        })

    }

    if(req.body.contacts !== null && req.body.target === 'contacts'){
 
          var contacts = req.body.contacts;
          var data = {id:req.body.id,contacts:contacts}; 

          Stakeholder.edit("contacts",data,function(err,upContacts){

            if(err) throw err;
            results.success = true
            results.message = "Stakeholder's contacts were successfully updated";
            return res.json(results); 

          })

    }

    if(req.body.groups !== null && req.body.target === 'groups'){
      
          var groups = req.body.groups.split(",");
          var data = {id:req.body._id,groups:groups};

          Stakeholder.edit("groups",data,function(err,upGroups){

            results.success = true
            results.message = "Stakeholder's groups were successfully updated";
            return res.json(results); 

          })

    }

      
  }

});

router.get('/stakeholders/:id',function(req,res){


  var schoolId = req.params.id;

  if(stakeholders.length == 0){

    Stakeholder.getAll(schoolId,function(err,results){

      if(err) throw err;
  
 
      populateStakeholders(0,results,function(err){

        if(err) throw err;

        return res.json(stakeholders); 

      })


    });

    }else{

        return res.json(stakeholders); 
    }

});


router.post('/assignGroup',function(req,res){

  var results = {success: false};

 

    Stakeholder.addGroup(req.body, function(err,newGroup){

      if(err){
        results.message = "Error assigning group name " + err;
        return res.json(results);
      }


      if(newGroup){
        results.message = "Group name already been assigned";
        return res.json(results);
      }else{
        results.success = true;
        results.message = "Group name is successfully assigned";

        return res.json(results);
      }

      
      

  })

});

function saveStakeholders(i,callback){

    if(i<dataSet.stakeholders.length){

      create(dataSet.stakeholders[i],function(err,stakeholder){
        
        if(err) callback(err);

        stakeholders.push(stakeholder);
        i++;
        saveStakeholders(i,callback);
      })
    }else{
      callback(null);
    }

}

function create(stakeholder,callback){

  var person = new Person();

  person.gender = stakeholder.gender;
  person.name.first = stakeholder.firstname;
  person.name.last = stakeholder.surname;

  person.save(function(err,newPerson){

    if(err) callback(err,null)


   var newStakeholder = new Stakeholder();
    
   
    if(stakeholder.cell){
      newStakeholder.contacts.push(stakeholder.cell);
    }


    if(stakeholder.cell1){
     
      newStakeholder.contacts.push(stakeholder.cell1);
    }

 if(dataSet.type === 'Parents'){

    if(stakeholder.cell2){
      newStakeholder.contacts.push(stakeholder.cell2);
    }

    var grade = stakeholder.grade.split(" ");

    newStakeholder.groups.push(grade[1]);

    if(stakeholder.class.length === 2)
      newStakeholder.class = stakeholder.class[1];

    if(stakeholder.class.length === 3)
      newStakeholder.class = stakeholder.class[2];

  }else{

      newStakeholder.groups.push(dataSet.type);
  }
    

    newStakeholder.schoolId = dataSet.schoolId;
    newStakeholder.personId = newPerson._id;

    newStakeholder.save(function(err,results){

      if(err) callback(err,null);

      var stakeholderVal = {

        id: results._id,
        name: newPerson.name.first + " " + newPerson.name.last,
        personId: newPerson._id,
        contacts: newStakeholder.contacts,
        groups: newStakeholder.groups
      };


      callback(null,stakeholderVal);

    })


  })



}



function populateStakeholders(i,items,callback){

  if(i<items.length){

    var stakeholder = {};

    Person.getDetails(items[i].personId, function(err,personInfo){

      stakeholder.id = items[i]._id;
      stakeholder.personId = items[i].personId;
      stakeholder.name = personInfo.name.first + " " + personInfo.name.last;
      stakeholder.contacts = items[i].contacts;
      stakeholder.class = items[i].class;
      stakeholder.groups = items[i].groups.map(function(group){
                            var results = group
                            if(!isNaN(group))
                            return 'Grade ' + group
                            else{return group}

                          });

      
  
      stakeholders.push(stakeholder);

      populateStakeholders(i+1,items,callback);
    })

  }else{

    callback(null);
  }
}








module.exports = router;