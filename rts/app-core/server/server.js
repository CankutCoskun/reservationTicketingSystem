const express = require('express');
const session = require('express-session');
const apiRouter = require('./routes/api');
const db = require('./db');
var path = require('path');
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

app.get('/getEventDetailPage/:eid', async function (req, res) {

    try {
        let eid = req.params.eid;
        console.log(eid);
        let event = await db.getEventById(eid);
        console.log("Event: ", event);
        //If you render relative path static/views/
        res.render('event-detail.html', {
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


app.get('/check', async (req, res) => {
    try {
        res.send({ status: 'ok' });
    } catch (error) {
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
        res.sendFile(path.resolve('static/web-pages/home.html'));
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/home', (req, res) => {
    try {
        res.sendFile(path.resolve('static/web-pages/home.html'));
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
                    //response.json(results);
                    response.redirect('/events');
                    //console.log("ege selam");

                }

                else if (utype == "GLOBAL") {
                    request.session.loggedin = true;
                    request.session.username = username;
                    response.redirect('/gadmin');

                }

                else if (utype == "LOCAL") {

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
    req.session.loggedin = false;
    res.redirect('/home');
});
//TO-DO app.post('/logout')

app.get('/events', function (req, res) {
    try {
        if (req.session.loggedin) {
            //res.send('Welcome back, ' + req.session.username + '!');
            res.sendFile(path.resolve('static/web-pages/event-pages/events.html'));
        }
        else {
            res.send('Please login to view this page!');
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

<<<<<<< HEAD
=======
app.get('/profile', async function (req, res) {




    try {
        if (req.session.loggedin) {
            let uname = req.session.username;
            console.log(uname);
            let user = await db.getUserByUname(uname);
            console.log("User: ",user);
            //res.send('Welcome back, ' + req.session.username + '!');
           // res.sendFile(path.resolve('static/web-pages/user_profile.html'));
            res.render('user_profile.html', {
                username: user.username,
                type: user.usertype,
                uid: user.uid,
                email: user.email,
                name_surname: user.name + " " + user.surname,
                name: user.name,
                surname:  user.surname,
                created: user.createdAt,
                updated: user.updatedAt
                
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

app.post('/createUser', async function (request, response) {
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
            response.redirect('/events');
        }

    }
    catch (e) {
        response.send('Already Registered User');
        response.end();
    }


});
app.post('/updateUser', async function (request, response) {
    console.log('update user request: ', request.body);
    var uid= request.body.uid;
    var username = request.body.uname;
    var password = request.body.password;
    var email = request.body.email;
    var name = request.body.name;
    var surname = request.body.surname;

    try {
        let results = await db.updateUser(uid, username, password, email, name, surname);
        console.log(results)
        
        if (results.message.length > 0) {
            
            response.redirect('/profile');
        }

    }
    catch (e) {
        response.send('Error in updating User');
        response.end();
    }


});




>>>>>>> origin/dev


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
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

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

app.get('/gadmin', (req, res) => {

    try {
        if (req.session.loggedin) {
            //res.send('Welcome back, ' + req.session.username + '!');
            res.sendFile(path.resolve('static/web-pages/admin-dashboard/global-admin.html'));
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



app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || '3000'}`);
}); 