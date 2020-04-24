const express = require('express');
const session = require('express-session');
const apiRouter = require('./routes/api');
const db = require('./db');
var path = require('path');
const url = require('url');
const nodemailer = require('nodemailer');
require('dotenv').config();
// TO-DO Encrypt password before sending to database
//const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const staticPath = path.resolve(__dirname, '..', 'static');
console.log("Current directory:", __dirname);
console.log('static path: ', staticPath);

const app = express();

//Render engine config
//In html syntax <%= var %>
app.set('views', process.cwd() + '/views');
app.engine('html', require('ejs').renderFile);


//Servin api calls
app.use('/api', apiRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Html static file root 
app.use(express.static(process.cwd() + '/static'));


app.get('/check', async (req, res) => {
    try {
        res.send({ status: 'ok' });
    } catch (error) {
        console.log(e);
        res.sendStatus(500);
    }
});


//App
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    //Session expires after a minute
    cookie: { maxAge: 3600000 },
}));

app.get('/', (req, res) => {
    try {
        res.sendFile(path.resolve('static/web-pages/home-page/home.html'));
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/home', (req, res) => {
    try {
        res.sendFile(path.resolve('static/web-pages/home-page/home.html'));
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/login', (req, res) => {
    try {
        res.sendFile(path.resolve('static/web-pages/login-signup/login-user.html'));
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.post('/auth', async (request, response) => {
    console.log('Authentication request: ', request.body);
    var username = request.body.username;
    var password = request.body.password;
    console.log(username);
    console.log(password);
    if (username && password) {
        //Validation
        try {

            let results = await db.authLogin(username, password);
            console.log(results);

            if (results.length > 0) {

                //Get the user type 
                var string = JSON.stringify(results);
                var json = JSON.parse(string);
                let utype = json[0].usertype;

                if (utype == "CUSTOMER") {
                    request.session.loggedin = true;
                    request.session.username = username;
                    request.session.utype = utype;
                    response.redirect('/events');

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
                //response.json({warning: "Incorrect credentials"});
                response.send('Incorrect Username and/or Password!');
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
    console.log('Log out request is recieved');
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
        let uname = req.session.username;
        let user = await db.getUserByUname(uname);
        let eid = req.params.eid;
        let event = await db.getEventById(eid);
        //If you render relative path /views/
        res.render('event-detail.html', {
            uId: user.uid,
            eId: event.eId,
            eTitle: event.title,
            eDetail: event.detail,
            eAddress: event.address,
            eDate: event.date,
            eCapacity: event.capacity,
            eStatus: event.status,
            eImagePath: event.imagePath
            //cId: event.cId;
        });
    } catch (error) {
        console.log(error);
    }

});

app.get('/ticketPurchasePage',  async (req, res) => {
    try {  
        console.log("Ticket purchase is called...");
        console.log(req.query); 
        let event = await db.getEventById(req.query.eid);
        let user = await db.getUserById(req.query.uid);
        res.render('ticket-purchase.html' ,{
            uId: user.uid,
            eId: event.eId,
            eTitle: event.title,
            eDetail: event.detail,
            eAddress: event.address,
            eDate: event.date,
            eCapacity: event.capacity,
            eStatus: event.status,
            eImagePath: event.imagePath
        });
    } catch (error) {
        console.log(error);
    }
});

//viewTciket?tid=12
app.get('/viewTicket/', async (req, res) => {
    try {
        if(req.session.loggedin){
            let tid = req.query.tid;
            let ticket = await db.getTicketById(tid);
            let event = await db.getEventById(ticket.eId);
            let user =  await db.getUserById(ticket.userid);
            console.log(ticket);
            res.render('view-ticket.html' ,{
                //<%=eDay%>
                //<%=eMonth%>
                //<%=eYear%>
                tId: tid,
                tNum: ticket.peoplenumber,
                tStatus: ticket.status,
                //ticket category will be added into db
                uId: user.uid,
                uName: user.name,
                eId: event.eId,
                eTitle: event.title,
                eDetail: event.detail,
                eAddress: event.address,
                eDate: event.date,
                eCapacity: event.capacity,
                eStatus: event.status,
                eImagePath: event.imagePath
            });
        }
        else{
                res.send("Please  login");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/createTicket',  async (req, res) => {
    try {
        let event = await db.getEventById(req.body.eid);
        let user = await db.getUserById(req.body.uid);
        if(event.remainingseat < req.body.peoplenumber){
            res.send("no seats left for this event");
        }
        else {
            let result = await db.addNewTicket(req.body.uid,req.body.peoplenumber,req.body.eid);
            let email = user.email; 
            let tid = result.insertId;
            let ticket =  db.getTicketById(tid);
            var name = user.name;
            var surname = user.surname;
            var eventTitle = event.title;
            var eventDetail = event.detail;
            var eventAdress = event.address;
            var eventDate = event.date;
            var numPeople = ticket.peoplenumber;
            const output = `
                <h3>Message</h3>
                <p>Hi ${name} ${surname}, Your ticket is created please find details below:</p>
                <h3>Event Details</h3>
                <ul>  
                <li><TITLE: ${eventTitle}</li>
                <li>DATE: ${eventDate}</li>
                <li>DETAIL: ${eventDetail}</li>
                <li>ADDRESS: ${eventAdress}</li>
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
                pathname: "/viewTicket",
                query: {
                   "tid": result.insertId
                 }             
              }));
        }
        
    } catch (error) {
        console.log(error);
    }
});

app.get('/profile', async function (req, res) {
    try {
        if (req.session.loggedin) {
            let uname = req.session.username;
            let user = await db.getUserByUname(uname);
            let tickets = await db.getActiveTicketsById(user.uid);
            console.log(tickets);
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
            res.send('Please login to view this page!');
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get('/company', async function (req, res) {
    try {
        if (req.session.loggedin) {
            let uname = req.session.username;
            console.log(uname);
            let a = await db.getCompIDbyUsername(uname);

            var string = JSON.stringify(a);
            var json = JSON.parse(string);
            let compid = json[0].id;
            let compname=json[0].name;
            console.log(a);
            let events = await db.getEventByCompanyId(compid);
            res.render('local-admin.html', {
                compid:compid,
                compname:compname,
                events: events
            });
        }
        else {
            res.send('Please login to view this page!');
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.post('/updateUser', async function (request, response) {
    console.log('update user request: ', request.body);
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
        response.send('Error in updating User');
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
    console.log('Authentication request: ', request.body);
    var username = request.body.uname;
    var password = request.body.password;
    var email = request.body.email;
    var name = request.body.name;
    var surname = request.body.surname;

    try {
        let results = await db.addNewUser(username, password, email, name, surname);
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

                res.render('contact', { msg: 'Email has been sent' });
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
            res.send('Please login to view this page!');
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

//Call admin dashboard page TO ADD NEW EVENT
app.get('/new-event', (req, res) => {
    try {
        res.sendFile(path.resolve('static/web-pages/admin-dashboard/add_event.html'));
    } catch (er) {
        throw er;
    }
});

app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || '3000'}`);
}); 