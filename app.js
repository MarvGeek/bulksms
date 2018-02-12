var app = require('express')();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3001;
var server = app.listen(port,function(){

	console.log('Listening on port '+port);

});
var io = require('./socket').init(server);

var home = require('./routes/user');
var school = require('./routes/school');
var contact = require('./routes/contact');
var stakeholder = require('./routes/stakeholder');
var message = require('./routes/message');
var mail = require('./routes/mail');
var compression = require('compression');
var helmet = require('helmet');

var registration = require('./routes/registration');
//var db = 'mongodb://localhost/bulksms';
//var db = 'mongodb://marv:marvgeek1603@ds261917.mlab.com:61917/bulksms';
var db = process.env.MONGODB_URI || 'mongodb://marv:marvgeek1603@ds261917.mlab.com:61917/bulksms';

//Connects or Create Database
mongoose.connect(db);

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression()); //Compress all routes
app.use(helmet());

app.use('/',home);
app.use('/api',school);
app.use('/api',contact);
app.use('/api',stakeholder);
app.use('/api',message);
app.use('/api',mail);
app.use('/api',registration);








module.exports.io = io;

//console.log(io);
//var server = require('http').createServer(app);
//var io = require('./socket').init(server);


//app.listen(port,function(){

	//console.log('Listening on port '+port)
//});
