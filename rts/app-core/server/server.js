/* eslint-disable no-unused-vars */
const express = require('express');
const session = require('express-session');
const apiRouter = require('./routes/api');
const db = require('./db');
var path = require('path');
const url = require('url');
const nodemailer = require('nodemailer');
const flash = require('express-flash');
// eslint-disable-next-line no-unused-vars
const cookieParser = require('cookie-parser');
require('dotenv').config();
// TO-DO Encrypt password before sending to database
//const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-unused-vars
const staticPath = path.resolve(__dirname, '..', 'static');
//console.log("Current directory:", __dirname);
//console.log('static path: ', staticPath);

const app = express();

const PDFDocument = require('pdfkit');

const fs = require("fs");

var gcClient = require('./gcp');

//Render engine config
//In html syntax <%= var %>
app.set('views', process.cwd() + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Servin api calls
app.use('/api', apiRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


//Html static file root 
app.use(express.static(process.cwd() + '/static'));



/*
app.use(function(req, res, next){
	// if there's a flash message in the session request, make it available in the response, then delete it
	res.locals.sessionFlash = req.session.sessionFlash;
	delete req.session.sessionFlash;
	next();
});

app.all('/session-flash', function( req, res ) {
	req.session.sessionFlash = {
		type: 'success',
		message: 'This is a flash message using custom middleware and express-session.'
	}
	res.redirect(301, '/');
});*/



app.get('/check', async (req, res) => {
	try {
		res.send({ status: 'ok' });
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});


//App
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 360000 },
}));



app.get('/', (req, res) => {
	try {
		res.sendFile(path.resolve('static/web-pages/home-page/home.html'));
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

app.get('/home', (req, res) => {
	try {
		res.sendFile(path.resolve('static/web-pages/home-page/home.html'));
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

app.get('/login', (req, res) => {
	try {
		res.sendFile(path.resolve('static/web-pages/login-signup/login-user.html'));
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

app.post('/auth', async (request, response) => {
	//console.log('Authentication request: ', request.body);

	var username = request.body.username;
	var password = request.body.password;
	//console.log(username);
	//console.log(password);
	if (username && password) {
		//Validation
		try {

			let results = await db.authLogin(username, password);
			//console.log(results);

			if (results.length > 0) {

				//Get the user type 
				var string = JSON.stringify(results);
				var json = JSON.parse(string);
				let utype = json[0].usertype;

				if (utype == "CUSTOMER") {
					request.session.loggedin = true;
					request.session.username = username;
					request.session.utype = utype;
					if (request.session.eid != null) {
						response.redirect('/getEventDetailPage/' + String(request.session.eid));
					}
					else {
						response.redirect('/events');
					}
				}

				else if (utype == "GLOBAL") {
					request.session.loggedin = true;
					request.session.username = username;
					request.session.utype = utype;
					response.redirect('/gadmin');

				}

				else if (utype == "LOCAL") {
					request.session.loggedin = true;
					request.session.username = username;
					request.session.utype = utype;
					response.redirect('/company');
				}

			} else {
				response.status(500).send({ error: 'Incorrect username or password' });
				//response.send('Incorrect Username and/or Password!');
			}

			response.end();

		} catch (e) {
			console.log(e);
		}
	}
	else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/logout', (req, res) => {
	//console.log('Log out request is recieved');
	req.session.destroy();
	res.redirect('/home');
});

app.get('/events', function (req, res) {
	try {
		if (req.session.loggedin) {
			//res.send('Welcome back, ' + req.session.username + '!');
			res.sendFile(path.resolve('static/web-pages/event-pages/events.html'));
		}
		else {
			//redirect to login/ homepage
			res.redirect('/login');
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});


app.get('/getEventDetailPage/:eid', async function (req, res) {

	try {
		if (req.session.username == undefined) {
			res.redirect('/login');
		}
		else {
			//console.log(req.path);
			//console.log(req.session);
			let uname = req.session.username;
			//console.log(uname);
			let user = await db.getUserByUname(uname);
			//console.log(user);
			let eid = req.params.eid;
			let event = await db.getEventById(eid);
			let eCategories = await db.getAllCategoriesByEventId(eid);
			let eVenue = await db.getVenueById(event.venueId);
			var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
			event.date = event.date.toLocaleDateString("en-US", dateOptions); // Saturday, September 17, 2016

			//If you render relative path /views/
			res.render('event-detail.html', {
				uId: user.uid,
				eId: event.eId,
				eTitle: event.title,
				eDetail: event.detail,
				eAddress: event.address,
				eDate: event.date,
				eTime: event.time,
				eCapacity: event.capacity,
				eStatus: event.status,
				eImagePath: event.imagePath,
				venuename: eVenue.name,
				seatingplan: eVenue.imagePath,
				categories: eCategories,
				venue: eVenue,
			});
		}

	} catch (error) {
		console.log(error);
	}

});

// TO-DO
app.get('/getEventDetailPageNoLogin/:eid', async function (req, res) {

	try {

		let eid = req.params.eid;
		let event = await db.getEventById(eid);
		//console.log(event);
		let eCategories = await db.getAllCategoriesByEventId(eid);
		//console.log(eCategories);
		let eVenue = await db.getVenueById(event.venueId);
		//console.log(eVenue);
		var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		event.date = event.date.toLocaleDateString("en-US", dateOptions); // Saturday, September 17, 2016

		//If you render relative path /views/
		res.render('event-detail-no-login.html', {
			eId: event.eId,
			eTitle: event.title,
			eDetail: event.detail,
			eAddress: event.address,
			eDate: event.date,
			eTime: event.time,
			eCapacity: event.capacity,
			eStatus: event.status,
			eImagePath: event.imagePath,
			venuename: eVenue.name,
			seatingplan: eVenue.imagePath,
			categories: eCategories,
			venue: eVenue,
		});

	} catch (error) {
		console.log(error);
	}

});


// TO-DO
app.get('/ticketPurchasePage', async (req, res) => {
	try {
		//console.log(req.query); 
		let event = await db.getEventById(req.query.eid);
		let venue = await db.getVenueById(event.venueId);
		let user = await db.getUserById(req.query.uid);
		let categories = await db.getAllCategoriesByEventId(req.query.eid);
		let d = new Date(event.date);
		res.render('ticket-purchase.html', {
			uId: user.uid,
			eId: event.eId,
			eTitle: event.title,
			eDetail: event.detail,
			eAddress: event.address,
			eDate: d.toDateString(),
			eTime: event.time,
			eCapacity: event.capacity,
			eStatus: event.status,
			eImagePath: event.imagePath,
			eVenue: venue,
			categories: categories
		});
	} catch (error) {
		console.log(error);
	}
});


// TO-DO
//viewTciket?tid=12
app.get('/viewTicket/', async (req, res) => {
	try {
		if (req.session.loggedin) {
			let tid = req.query.tid;
			let seatMessages= req.query.seats;
			console.log(seatMessages);
			let ticket = await db.getTicketById(tid);
			let category = await db.getCategoryById(ticket.categoryid);

			let event = await db.getEventById(category.eventid);
			let venue = await db.getVenueById(event.venueId);

			let user = await db.getUserById(ticket.userid);
			//console.log(ticket);
			res.render('view-ticket.html', {
				tId: tid,
				tNum: ticket.peoplenumber,
				tStatus: ticket.status,
				uId: user.uid,
				uName: user.name,
				uSurname: user.surname,
				eId: event.eId,
				eTitle: event.title,
				eDetail: event.detail,
				eVenue: venue.name,
				eDate: event.date,
				eCapacity: event.capacity,
				eStatus: event.status,
				eImagePath: event.imagePath,
				categoryName: category.categoryname,
				price: category.price,
				seats: ticket.seatlist
			});
		}
		else {
			res.redirect("/login");
		}
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});


// TO-DO
app.post('/createTicket', async (req, res) => {
	try {
		let eid=req.body.eid;

		let seatlist= req.body.seatlist.split(',');
		let peoplenumber= seatlist.length;
		let categorysymbol= String(req.body.categorysymbol);
		let category = await db.getCategoryIdBySymbolAndEId(categorysymbol,eid);
		let categoryId= category.categoryid;
		let seatMessages='';
		for(var i=0; i< seatlist.length; i++){
			var lst = seatlist[i].split("_");
			let rowS= lst[0];
			let colS= lst[1];
			let rowN = parseInt(rowS);
			let colN = parseInt(colS);
			if(i==seatlist.length-1){
				seatMessages= seatMessages.concat( rowS + '_' + colS + ' ' );
			}
			else{
				seatMessages= seatMessages.concat( rowS + '_' + colS + ',  ' );

			}
			let updateresults = await db.UpdateSeatStatus(eid,rowN,colN,'booked');
		}

		let event = await db.getEventById(req.body.eid);
		let user = await db.getUserById(req.body.uid);
		if (event.remainingseat < peoplenumber) {
			res.send("no seats left for this event");
		}
		else {
			let result = await db.addNewTicket(req.body.uid, peoplenumber, req.body.eid,categoryId,seatMessages );
			let email = user.email;
			let tid = result.insertId;
			let ticket = await db.getTicketById(tid);
			//console.log(ticket);
			
			let categoryInfo = await db.getPriceFromCategory(categoryId);
			var p1=categoryInfo[0].price;
			let totalprice=(peoplenumber)*p1;
			let invoice=await db.addNewInvoice(tid,totalprice);

			var name = user.name;
			console.log(name);
			var surname = user.surname;
			var eventTitle = event.title;
			var eventDetail = event.detail;
			//var eventAdress = event.address;
			var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
			var eventDate = event.date.toLocaleDateString("en-US", dateOptions); // Saturday, September 17, 2016
			var eventImagePath = event.imagePath;
			var numPeople = ticket.peoplenumber;
			const output = `
                <h3>Hi ${name} ${surname},</h3>
                
                <p> Your ticket is created please see details below:</p>
                <h4>${eventTitle}</h4>
                <ul>
				<li>TICKET ID: ${ticket.id}</li>
				<li>SEATS (ROW_COLUMN): ${seatMessages}</li>
                <li>NUMBER: ${numPeople}</li>  
                <li>DATE: ${eventDate}</li>
                <li>DETAIL: ${eventDetail}</li>
                </ul>
                <img src='${eventImagePath}'></img>
            `;

			// create reusable transporter object using the default SMTP transport
			var transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASSWORD
				}
			});

			// setup email data with unicode symbols
			let mailOptions = {
				from: 'cs308reservationsystem@gmail.com', // sender address
				to: email, // list of receivers
				subject: 'New Ticket', // Subject line
				html: output // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: %s', info.messageId);
			});

			res.redirect(url.format({
				pathname: '/viewTicket',
				query: {
					"tid": result.insertId,
					"seats": seatMessages
				}
			}));

			// invoice pdf 
			let pdf = new PDFDocument({ size: "A4", margin: 50 });

			

            let buffers = [];
            pdf.on('data', buffers.push.bind(buffers));
            pdf.on('end', () => {

                let pdfData = Buffer.concat(buffers);

                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });

                const mailOptions = {
                    from: 'cs308reservationsystem@gmail.com', // sender address
                    to: email, // list of receivers
                    attachments: [{
                        filename: 'attachment.pdf',
                        content: pdfData
                    }]
                };

                mailOptions.subject = 'PDF in mail';
                mailOptions.text = 'PDF attached';
                
                return transporter.sendMail(mailOptions).then(() => {
                    console.log('email sent:');
                }).catch(error => {
                    console.error('There was an error while sending the email:', error);
                });

            });
		    let ipath="./server/Inovice_Uploads/";
			let pdfname=invoice.insertId.toString()+"_invoice.pdf";
			//pdf.text(invoice.insertId.toString(), 100, 100);
			///*////////////////////////////////



			let compinfo=await db.getCompanyDetailsByCompID(event.cId);
			console.log(compinfo[0].name);
			console.log(compinfo[0].companyAddress);
			let fotopath="./server/"
			
			pdf.image(path.resolve(fotopath+"1589117003337_su1.jpg"), 50, 45, { width: 120 }) 
    		pdf.fillColor("#444444");
    		pdf.fontSize(20);
			//pdf.text(compinfo[0].name, 110, 57); 
			pdf.fontSize(10);
			pdf.text(compinfo[0].name, 200, 50, { align: "right" });
			pdf.text(compinfo[0].companyAddress, 200, 65, { align: "right" });
			//pdf.text("Turke, 200, 80, { align: "right" });
			pdf.moveDown();
			pdf.fillColor("#444444");
			pdf.fontSize(20);
			pdf.text("Invoice", 50, 160);
			pdf.strokeColor("#aaaaaa");
			pdf.lineWidth(1);
			pdf.moveTo(50, 185);
			pdf.lineTo(550, 185);
			pdf.stroke();
			pdf.fontSize(10);

			//fatura bilgileri ve kişi bilgileri 

			const customerInformationTop = 200;
			pdf.text("Invoice Number:", 50, customerInformationTop);
			pdf.font("Helvetica-Bold");
			pdf.text(invoice.insertId, 150, customerInformationTop);
			pdf.font("Helvetica");
			pdf.text("Invoice Date:", 50, customerInformationTop + 15);

			var d = new Date();
			const day = d.getDate();
			const month = d.getMonth() + 1;
			const year = d.getFullYear();
		  
			let nd= year + "/" + month + "/" + day;

			pdf.text(nd, 150, customerInformationTop + 15);
			pdf.text("Balance Due:", 50, customerInformationTop + 30);
			pdf.text(totalprice.toString()+" TL",150,customerInformationTop + 30);

			pdf.font("Helvetica-Bold");
			pdf.text(user.name + " " + user.surname, 300, customerInformationTop);
			pdf.font("Helvetica");
			pdf.text(user.email, 300, customerInformationTop + 15);
			pdf.moveDown();

			pdf.strokeColor("#aaaaaa");
			pdf.lineWidth(1);
			pdf.moveTo(50, 252);
			pdf.lineTo(550, 252);
			pdf.stroke();


			// fatura tablosu 
			const invoiceTableTop = 330;			
			pdf.font("Helvetica-Bold");
			pdf.fontSize(10)
			pdf.text("Event", 50, 330)
			pdf.text("Date", 150, 330, { width: 90, align: "right" })
			pdf.text("Unit Cost", 280, 330, { width: 90, align: "right" })  
  			pdf.text("Quantity", 370, 330, { width: 90, align: "right" })
  			pdf.text("Total", 0, 330, { align: "right" });
  			pdf.strokeColor("#aaaaaa")
  			pdf.lineWidth(1)
  			pdf.moveTo(50, 350)
  			pdf.lineTo(550, 350)
			pdf.stroke();
			  
			//fatura satırı 
			const position = invoiceTableTop + (1) * 30;
			pdf.fontSize(10)
			pdf.text(event.title, 50, position)
			var a=event.date.toString();
			var b=a.substr(0,15);
			pdf.text(b, 200, position)
			pdf.text(p1.toString()+" TL", 280, position, { width: 90, align: "right" })
			pdf.text(peoplenumber, 370, position, { width: 90, align: "right" })
			pdf.text(totalprice.toString()+" TL", 0, position, { align: "right" });




			/////////////*/////////////////////////
			pdf.pipe(fs.createWriteStream(path.resolve(ipath+pdfname)));
			await db.setInvoicePath(invoice.insertId,gcClient.getPublicUrlForItem(pdfname));		
			pdf.end();
			await gcClient.uploadFile(path.resolve(ipath+pdfname));
			
		}

	} catch (error) {
		console.log(error);
	}
});


app.get('/deleteTicket/', async (req, res) => {
	try {

		let tid = req.query.tid;
		let pnum = req.query.pnum;
		let categoryid = req.query.categoryid;
		let invoice = req.query.invoice;
		// eslint-disable-next-line no-unused-vars
		let ticket= await db.getTicketById(tid);
		let eid= ticket.eventid;
		let seatlist= ticket.seatlist.split(',');
		for(var i=0; i< seatlist.length -1 ; i++){
				var lst = seatlist[i].split("_");
				let rowS= lst[0];
				let colS= lst[1];
				let rowN = parseInt(rowS);
				let colN = parseInt(colS);
				let unbookingSeatsResults= await db.UpdateSeatStatus(eid,rowN,colN,'active');

		}
		let result = await db.deleteTicket(tid, pnum, categoryid);
		//let result = await db.deleteTicket(tid);
		console.log('session:'+ req.session.username);
		if(req.session.username==null){
			res.redirect('/login');
		}
		let user = await db.getUserByUname(req.session.username);
		let email = user.email;

		var name = user.name;
		var surname = user.surname;


		const output = `
		<h3>Hi ${name} ${surname},</h3>
		
		<p> Your ticket is deleted please see details below:</p>
		
		<ul>
		<li>TICKET ID: ${tid}</li>
		<li>NUMBER OF SEATS: ${pnum}</li>  
		<a href='${invoice}'> SEE Invoice </a>
		</ul>
		<img src='${invoice}'></img>
	`;

		// create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: 'cs308reservationsystem@gmail.com', // sender address
			to: email, // list of receivers
			subject: 'Ticket Deleted', // Subject line
			html: output // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
		});

		res.redirect('/profile');

	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

// TO-DO
app.get('/profile', async function (req, res) {
	try {
		if (req.session.loggedin) {
			let uname = req.session.username;
			let user = await db.getUserByUname(uname);
			let tickets = await db.getTicketsByUserId(user.uid);
			//console.log("Tİckets ===" +tickets);
			//res.send('Welcome back, ' + req.session.username + '!');
			// res.sendFile(path.resolve('static/web-pages/user_profile.html'));
			res.render('user_profile.html', {
				username: user.username,
				type: user.usertype,
				uid: user.uid,
				email: user.email,
				name_surname: user.name + " " + user.surname,
				name: user.name,
				surname: user.surname,
				created: user.createdAt,
				updated: user.updatedAt,
				tickets: tickets
			});

		}
		else {
			res.redirect("/login");
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

app.post('/events/search', async (req, res) => {
	try {
		//console.log("IN EVENTS SEARCH")
		//console.log(req.body);
		let results = await db.searchEvents(req.body.type, req.body.date, req.body.location, req.body.text);
		let date = new Date(req.body.date);
		//console.log(results);
		res.render('search-events.html', {
			type: req.body.type,
			date: date.toDateString(),
			city: req.body.location,
			events: results
		});
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

app.get('/company', async function (req, res) {
	try {
		if (req.session.loggedin) {
			let uname = req.session.username;
			let cid = await db.getCompIDbyUsername(uname);
			var string = JSON.stringify(cid);
			var json = JSON.parse(string);
			let compid = json[0].id;
			let company = await db.getCompanyById(compid);
			let compname = json[0].name;
			let events = await db.getEventByCompanyId(compid);
			let venues = await db.getVenuesByCompanyId(compid);
			res.render('local-admin.html', {
				//async: true,
				compid: compid,
				compname: compname,
				events: events,
				venues: venues,
				logoPath: company.imagePath
			});
		}
		else {
			res.redirect("/admin");
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

app.post('/updateUser', async function (request, response) {
	//console.log('update user request: ', request.body);
	var uid = request.body.uid;
	var username = request.body.uname;
	var password = request.body.password;
	var email = request.body.email;
	var name = request.body.name;
	var surname = request.body.surname;

	try {
		let results = await db.updateUser(uid, username, password, email, name, surname);

		if (results.message.length > 0) {

			response.redirect('/profile');
		}

	}
	catch (e) {
		response.send(500);
		response.end();
	}

});

app.get('/signup', (req, res) => {

	try {
		res.sendFile(path.resolve('static/web-pages/login-signup/signup.html'));
	}
	catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

app.post('/createUser', async function (request, response) {
	//email feature added
	//console.log('Authentication request: ', request.body);
	var username = request.body.uname;
	var password = request.body.password;
	var email = request.body.email;
	var name = request.body.name;
	var surname = request.body.surname;

	try {
		await db.addNewUser(username, password, email, name, surname);
		let results2 = await db.authLogin(username, password);

		if (results2.length > 0) {
			request.session.loggedin = true;
			request.session.username = username;
			//response.json(results);

			const output = `
                <h3>Message</h3>
                <p>Hi ${name} ${surname}, Your account has been created</p>
                <h3>User Details</h3>
                <ul>  
                <li>Name: ${name}</li>
                <li>Surname: ${surname}</li>
                <li>Email: ${email}</li>
                <li>Username: ${username}</li>
                </ul>
            `;

			// create reusable transporter object using the default SMTP transport
			var transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASSWORD
				}
			});

			// setup email data with unicode symbols
			let mailOptions = {
				from: 'cs308reservationsystem@gmail.com', // sender address
				to: email, // list of receivers
				subject: 'New User', // Subject line
				html: output // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: %s', info.messageId);
				response.render('contact', { msg: 'Email has been sent' });
			});
			response.redirect('/events');
		}

	}
	catch (e) {
		response.send('Already Registered User');
		response.end();
	}
});

app.get('/gadmin', async function (req, res) {

	try {
		if (req.session.loggedin) {
			let company = await db.getCompaines();
			res.render('global-admin.html', {
				company: company
			});
		}
		else {
			res.redirect("/login");
		}
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

app.get('/admin', (req, res) => {

	try {
		res.sendFile(path.resolve('static/web-pages/login-signup/login-admin.html'));
	}
	catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

// TO-DO
//Call admin dashboard page TO ADD NEW EVENT
app.get('/new-event', (req, res) => {
	res.sendFile(path.resolve('static/web-pages/admin-dashboard/add_event.html'));
});

app.listen(process.env.PORT || '3000', () => {
	console.log(`Server is running on port: ${process.env.PORT || '3000'}`);
}); 