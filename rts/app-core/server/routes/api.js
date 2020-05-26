/* eslint-disable no-empty */
const express = require('express');
const db = require('../db');
const router = express.Router();
var path = require('path');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//fs is never used ? 
// eslint-disable-next-line no-unused-vars
const fs = require('fs');
//Google cloud client
var gcClient = require('../gcp');
var multer = require('multer');

// const multerGoogleStorage = require("multer-google-storage");
// var uploadHandler = multer({
//     storage: multerGoogleStorage.storageEngine()
// });

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let destPath = path.resolve('./static/uploads');
		//console.log("Destination path:  ", destPath);
		cb(null, destPath);
	},
	filename: (req, file, cb) => {
		let ts = Date.now();
		cb(null, ts + '_' + file.originalname);
	}
});

var upload = multer({ storage: storage });
const nodemailer = require('nodemailer');
require('dotenv').config();

// CRUD Apis

/********************* ********** USER *******************************/

router.get('/users/', async (req, res) => {

	try {
		let results = await db.getAllUsers();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}

});

router.get('/users/:id', async (req, res) => {
	try {
		let results = await db.getUserById(req.params.id);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.post('/users/add', async (req, res) => {
	try {
		console.log('Request Body: ', req.body);
		let result = await db.addNewUser(req.body.uname, req.body.password, req.body.email, req.body.name, req.body.surname);
		res.json(result);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

/******************************* EVENT *******************************/

router.get('/events/', async (req, res) => {
	try {
		let results = await db.getEvents();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.get('/calendarevents/', async (req, res) => {
	try {
		let results = await db.getEvents();

		if (results) {
			res.json({});
		}
		else {
			let events = [];
			for (var i = 0; i < 2; i++) {
				var event = new Object();
				event.title = String(results[i].title);
				event.start = results[i].date;
				event.url = '/getEventDetailPageNoLogin/' + String(results[i].eId);
				events.push(event);
			}
			res.json(events);
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.get('/events/:id', async (req, res) => {
	try {
		let result = await db.getEventById(req.params.id);
		res.json(result);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.get('/eventsbytype/:eventtype', async (req, res) => {
	try {
		//console.log(req.params.eventtype);
		let results = await db.getEventsbyType(req.params.eventtype);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.post('/events/search', async (req, res) => {
	try {
		//console.log("IN EVENTS SEARCH")
		//console.log(req.body);
		let results = await db.searchEvents(req.body.type, req.body.date, req.body.location, req.body.text);
		//console.log(results);
		res.json(results);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

// TO-DO
// Add events with image upload
router.post('/events/add', upload.single('myFile'), async (req, res) => {

	try {
		//console.log("Attached file: ", req.file);
		console.log("Request body: ", req.body);
		const file = req.file;

		if (!file) {
			console.log("No file received");
			res.send("No File is attached. Please add a file");
		}

		//Relative to static directory
		//console.log("file received: ", file.path);
		await gcClient.uploadFile(file.path).catch(console.error);
		await db.addNewEvent(req.body.compid, req.body.eventtitle,
			req.body.eventvenue, req.body.eventdate,
			req.body.eventtime, req.body.eventtype,
			req.body.eventdetail, req.body.city, gcClient.getPublicUrlForItem(file.filename));
		console.log("???????");
		res.redirect("/company");

	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

//delete event by id
router.delete('/events/delete/:eId', async (req, res) => {
	try {
		let result = await db.deleteEvent(req.params.eId);
		//console.log(result);
		res.send(result);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});


/******************************* VENUE *******************************/

// TO-DO
// Add venue with image upload
router.post('/venues/add', upload.single('myFile'), async (req, res) => {

	try {
		//console.log("Attached file: ", req.file);
		//console.log("Request body: ", req.body);
		const file = req.file;

		if (!file) {
			console.log("No file received");
			res.send("No File is attached. Please add a file");
		}

		//Relative to static directory
		//console.log("file received: ", file.path);
		await gcClient.uploadFile(file.path).catch(console.error);
		await db.addNewVenue(req.body.compid, req.body.vname, req.body.vcap,
			gcClient.getPublicUrlForItem(file.filename));

		res.redirect("/company");

	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});


router.delete('/venues/delete/:vid', async (req, res) => {
	try {
		// eslint-disable-next-line no-unused-vars
		let result = await db.deleteVenue(req.params.vid);
		//console.log(result);
		res.send("venue deleted");
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.delete('/events/category/delete/:cid', async (req, res) => {
	try {
		await db.deleteCategory(req.params.cid);
		res.send("category deleted");
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

router.post('/events/category/add/:eid', async (req, res) => {
	try {
		//console.log(req.body);
		await db.addCategory(req.params.eid, req.body.cname, req.body.ccap, req.body.cprice);
		//console.log({ "message": "Category is added" });
		res.redirect('/company');
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}

});

router.get('/events/category/all/:eid', async (req, res) => {
	try {
		// eslint-disable-next-line no-unused-vars
		let results = await db.getAllCategoriesByEventId(req.params.eid);
		res.json(results);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

/******************************* COMPANY *******************************/

router.post('/company/add', upload.single('myFile'), async (req, res) => {

	try {
		//console.log("Request body: ", req.body);
		const file = req.file;

		if (!file) {
			console.log("No file received");
			res.send("No File is attached. Please add a file");
		}

		await gcClient.uploadFile(file.path).catch(console.error);
		var atype = "LOCAL";
		await db.addNewLocalAdmin(req.body.companyusername, req.body.companypassword, req.body.companyemail, atype);
		await db.addNewCompany(req.body.companyusername, req.body.companyname, req.body.companyaddress,
			gcClient.getPublicUrlForItem(file.filename));

		const output = `
        
        <h3>Message</h3>
        <p>Hi ${req.body.companyname}, Your account has been created</p>
        <h3>Company Details</h3>
        <ul>  
        <li>Company Name: ${req.body.companyname}</li>
        <li>Email: ${req.body.companyemail}</li>
        <li>Company Username: ${req.body.companyusername}</li>
        <li>Password: ${req.body.companypassword}</li>
        <li>Company Address: ${req.body.companyaddress}</li>
        
        </ul>`;

		// create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				// eslint-disable-next-line no-undef
				user: process.env.EMAIL,
				// eslint-disable-next-line no-undef
				pass: process.env.PASSWORD
			}
		});


		// setup email data with unicode symbols
		let mailOptions = {
			from: 'cs308reservationsystem@gmail.com', // sender address
			to: req.body.companyemail, // list of receivers
			subject: 'New Company', // Subject line
			html: output // html body
			//email with company picture
			/* attachments: [{   // stream as an attachment
                 filename: 'image.jpg',
                 content: fs.createReadStream(filePath)
             }]*/
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error) => {
			if (error) {
				return console.log(error);
			}
			//console.log('Message sent: %s', info.messageId);
			//console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

			res.render('contact', { msg: 'Email has been sent' });
		});

		//res.json({ message: 'company is added' });
		res.redirect('http://localhost:3000/gadmin');

	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

//delete company by company id
router.delete('/companies/delete/:id', async (req, res) => {
	try {
		let result1 = await db.getUserIDbyCompID(req.params.id);
		var string = JSON.stringify(result1);
		var json = JSON.parse(string);
		let id = json[0].adminId;
		// eslint-disable-next-line no-unused-vars
		let result = await db.deleteCompany(id);
		//console.log(result);
		res.send("company deleted");
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

/******************************* TICKET *******************************/

// TO-DO
router.post('/ticketBuy/:eid', async (req, res) => {
	try {
		console.log('Request Body: ', req.body);
		let event = await db.getEventById(req.params.eid);
		if (event.remainingseat < req.body.peoplenumber) {
			res.send("no seats left for this event");
		}
		else {

			let result = await db.addNewTicket(req.body.userid, req.body.peoplenumber, req.params.eid);
			res.json(result);
		}

	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});


module.exports = router;