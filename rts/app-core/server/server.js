const express = require('express');
const session = require('express-session');
const apiRouter = require('./routes/api');
const db = require('./db');
var path = require('path');
// TO-DO Encrypt password before sending to database
//const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();

//Servin api calls
app.use('/api', apiRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());


const staticPath = path.resolve(__dirname, '..', 'static');
console.log('static path: ', staticPath);

//Html static file root 
app.use(express.static(process.cwd() + '/static'));

console.log("Current directory:", __dirname); 


app.get('/check', async (req, res) => {
    try {
        res.send({status: 'ok'});
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
    cookie: { maxAge: 60000 },
}));

app.get('/test', (req, res) => {
    try{
        res.sendFile(path.resolve('static/web-pages/event-pages/home.html'));
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

app.get('/login', (req, res) => {
    try{
        res.sendFile(path.resolve('static/login.html'));
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

app.post('/auth', async function(request, response) {
    console.log(request.body);
    var username = request.body.username;
    var password = request.body.password;

	if (username && password) {
        //Validation
        try {

            let results = await db.authLogin(username, password);

            if (results.length > 0) {
				request.session.loggedin = true;
                request.session.username = username;
                //response.json(results);
				response.redirect('/home');
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

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || '3000' }`);
}); 