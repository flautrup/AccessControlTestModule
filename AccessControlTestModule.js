/*
============================================================================================
File: AccessControlTestModule.js
Developer: Fredrik Lautrup
Created Date: Sometime in 2014

Description:
The AccessControlTestModule uses node.js and express.js to create a lightweight web
server for testing the ticketing authentication method in Qlik Sense Enterprise Server.

WARNING!:
This code is intended for testing and demonstration purposes only.  It is not meant for
production environments.  In addition, the code is not supported by Qlik.

Change Log
Developer                       Change Description                          Modify Date
--------------------------------------------------------------------------------------------
Fredrik Lautrup                 Initial Release                             circa Q4 2014
Jeffrey Goldberg                Updated for Expressjs v4.x                  01-June-2015
Fredrik Lautrup                 Added external config file                  03-November-2015
Steve Newman                    Updated Logout method and iframe support    07-January-2016

--------------------------------------------------------------------------------------------


============================================================================================
*/

var config = require('./config');
var https = require('https');
var http = require('http');
var express=require('express');
var fs = require('fs');
var url= require('url');

var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var querystring = require("querystring");

var app = express();
//set the port for the listener here
app.set('port', config.port);


//new Expressjs 4.x notation for configuring other middleware components
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: config.sessionSecret}));
app.use(cookieParser('Test'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
      console.log("Root request, received:", req.query);
      res.sendfile('SelectUser.htm');
 });

app.get('/logout', function (req, res) {
	var selectedUser = req.query.selectedUser;
    var userDirectory = req.query.userDirectory;
    console.log("Logout user: "+selectedUser+" directory: "+userDirectory);

	logout(req,res,selectedUser,userDirectory);
	req.session.destroy();
});

app.get('/login', function (req, res) {
    var selectedUser = req.query.selectedUser;
    var userDirectory = req.query.userDirectory;
    console.log("Login user: "+selectedUser+" Directory: "+userDirectory);

    requestticket(req, res, selectedUser, userDirectory);
	req.session.destroy();
});

app.get("/resource/font", function (req, res) {
    res.sendfile('qlikview-sans.svg');
});

app.get("/resource/icon", function (req, res) {
    res.sendfile("users.png");
});

app.get("/resource/qv", function (req, res) {
    res.sendfile("QlikLogo-RGB.png");
});

app.get("/resource/background", function (req, res) {
    res.sendfile("ConnectingCircles-01.png");
});


function logout(req, res, selectedUser, userDirectory) {

    //Configure parameters for the logout request
    var options = {
        host: url.parse(config.RESTURI).hostname,
        port: url.parse(config.RESTURI).port,
        path: url.parse(config.RESTURI).path+'/user/'+userDirectory.toString()+'/' + selectedUser.toString() + '?xrfkey=aaaaaaaaaaaaaaaa',
        method: 'DELETE',
        headers: { 'X-qlik-xrfkey': 'aaaaaaaaaaaaaaaa', 'Content-Type': 'application/json' },
		pfx: fs.readFileSync('client.pfx'),
		passphrase: config.certificateConfig.passphrase,
		rejectUnauthorized: false,
        agent: false
    };

    console.log("Path:", options.path.toString());
    //Send request to get logged out
    var ticketreq = https.request(options, function (ticketres) {
        console.log("statusCode: ", ticketres.statusCode);
        //console.log("headers: ", ticketres.headers);

        ticketres.on('data', function (d) {
			console.log(selectedUser, " is logged out");
            console.log("DELETE Response:", d.toString());
			
            redirectURI = '/';

            console.log("Logout redirect:", redirectURI);
            res.redirect(redirectURI);
        });
    });

    //Send request to logout
    ticketreq.end();

    ticketreq.on('error', function (e) {
        console.error('Error' + e);
    });
};


function requestticket(req, res, selecteduser, userdirectory) {

    //Configure parameters for the ticket request
    var options = {
        host: url.parse(config.RESTURI).hostname,
        port: url.parse(config.RESTURI).port,
        path: url.parse(config.RESTURI).path + '/ticket?xrfkey=aaaaaaaaaaaaaaaa',
        method: 'POST',
        headers: { 'X-qlik-xrfkey': 'aaaaaaaaaaaaaaaa', 'Content-Type': 'application/json' },
		pfx: fs.readFileSync('client.pfx'),
		passphrase: config.certificateConfig.passphrase,
		rejectUnauthorized: false,
        agent: false
    };

	console.log("Path:", options.path.toString());
    //Send ticket request
    var ticketreq = https.request(options, function (ticketres) {
        console.log("statusCode: ", ticketres.statusCode);
        //console.log("headers: ", ticketres.headers);

        ticketres.on('data', function (d) {
            //Parse ticket response
			console.log(selecteduser, " is logged in");
			console.log("POST Response:", d.toString());
			
            var ticket = JSON.parse(d.toString());
			
			//Add the QlikTicket to the redirect URL regardless whether the existing REDIRECT has existing params.
			var myRedirect = url.parse(config.REDIRECT);
			
			var myQueryString = querystring.parse(myRedirect.query);
			myQueryString['QlikTicket'] = ticket.Ticket; 

            redirectURI = '/?selecteduser='+ selecteduser;

			//This replaces the existing REDIRECT querystring with the one with the QlikTicket.			
			if (typeof(myRedirect.query) == 'undefined' || myRedirect.query === null) {
				redirectURI += '&QlikRedirect='+ querystring.escape(myRedirect.href + '?' + querystring.stringify(myQueryString));
			} else {
				redirectURI += '&QlikRedirect='+ querystring.escape(myRedirect.href.replace(myRedirect.query,querystring.stringify(myQueryString)));
			}			

            console.log("Login redirect:", redirectURI);
            res.redirect(redirectURI);
        });
    });

    //Send JSON request for ticket
    var jsonrequest = JSON.stringify({ 'UserDirectory': userdirectory.toString() , 'UserId': selecteduser.toString(), 'Attributes': [] });

    ticketreq.write(jsonrequest);
    ticketreq.end();

    ticketreq.on('error', function (e) {
        console.error('Error' + e);
    });
};

//Server options to run an HTTPS server
var httpsoptions = {
    pfx: fs.readFileSync('server.pfx'),
    passphrase: config.certificateConfig.passphrase
};

//Start listener
var server = https.createServer(httpsoptions, app);
server.listen(app.get('port'), function()
{
  console.log('Express server listening on port ' + app.get('port'));
});
