const express = require('express');
const db = require('../db');
const router = express.Router();
var path = require('path');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//fs is never used ? 
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
        console.log("Destination path:  ", destPath);
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

/******************************* USER *******************************/

router.get('/users/', async (req, res) => {

    try {
        let results = await db.getAllUsers();
        res.sendFile
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

});

router.get('/users/:id', async (req, res, next) => {
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
})

/******************************* EVENT *******************************/

router.get('/events/', async (req, res, next) => {
    try {
        let results = await db.getEvents();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/calendarevents/', async (req, res, next) => {
    try {

        let results = await db.getEvents();
        console.log(results.length);
        let events =[];
        for (i=0; i<2 ;i++) {
            //console.log(r[0]);
            event = new Object()
            event.title = String(results[i].title);
            event.start = results[i].date;
            event.url='/getEventDetailPageNoLogin/'+ String(results[i].eId) ;
            events.push(event);
          }
        
        res.json(events);
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

router.get('/eventsbytype/:eventtype', async (req, res, next) => {
    try {
        console.log(req.params.eventtype);
        let results = await db.getEventsbyType(req.params.eventtype);       
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// Add events with image upload
router.post('/events/add', upload.single('myFile'), async (req, res, next) => {

    try {
        console.log("Attached file: ", req.file);
        console.log("Request body: ", req.body);
        const file = req.file;

        if (!file) {
            console.log("No file received");
            res.send("No File is attached. Please add a file");
        }

        //Relative to static directory
        console.log("file received: ", file.path);
        await gcClient.uploadFile(file.path).catch(console.error);
        let db_result = await db.addNewEvent(req.body.compid, req.body.eventtitle, 
                                            req.body.eventvenue, req.body.eventdate, 
                                            req.body.eventtime, req.body.eventcapacity, 
                                            req.body.eventdetail, gcClient.getPublicUrlForItem(file.filename));

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
        console.log(result);
        res.send("event deleted");
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

/******************************* COMPANY *******************************/

router.post('/company/add', upload.single('myFile') ,async (req, res, next) => {

    try {
        console.log("Attached file: ", req.file);
        console.log("Request body: ", req.body);
        const file = req.file;

        if (!file) {
            console.log("No file received");
            res.send("No File is attached. Please add a file");
        }

        //Relative to static directory
        let filePath = 'uploads/' + file.filename;
        console.log("file received: ", filePath);

        var atype = "LOCAL";
        let db_result1 = await db.addNewLocalAdmin(req.body.companyusername, req.body.companypassword, req.body.companyemail, atype);
        let db_result = await db.addNewCompany(req.body.companyusername, req.body.companyname, req.body.companyaddress, filePath);

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
                user: process.env.EMAIL,
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
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('contact', { msg: 'Email has been sent' });
        });

        //res.json({ message: 'company is added' });
        res.redirect('http://localhost:3000/gadmin')

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
        console.log(id);
        let result = await db.deleteCompany(id);
        //console.log(result);
        res.send("company deleted");
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

/******************************* TICKET *******************************/

router.post('/ticketBuy/:eid', async (req, res) => {
    try {
        console.log('Request Body: ', req.body );   
        let event= await db.getEventById(req.params.eid);
        if(event.remainingseat < req.body.peoplenumber   ){
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
})


module.exports = router;