/*
Remote db properties:

username = doadmin
password = lomdyrob8p6pb56g hide
host = cs308db-do-user-7358055-0.a.db.ondigitalocean.com
port = 25060
database = reservations
sslmode = REQUIRED

*/

const mysql = require('mysql');
let userID;

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'lomdyrob8p6pb56g',
    user: 'doadmin',
    database: 'reservations',
    host: 'cs308db-do-user-7358055-0.a.db.ondigitalocean.com',
    port: '25060',
    multipleStatements:true 
});

let db = {};

db.getAllUsers = () => {

    return new Promise((resolve, reject) => {

        pool.query(`SELECT * FROM Users`, (err, results) => {
            if (err) {
                console.log('ERROR: .all()');
                return reject(err);
            }

            return resolve(results);
        });
    });
};

db.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM Users WHERE uid = ?`, [id], (err, results) => {
            if (err) {
                console.log('ERROR: .getUserById()');
                return reject(err);
            }

            return resolve(results[0]);
        });
    });
};

db.getUserByUname = (uname) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM Users WHERE username = ?`, [uname], (err, results) => {
            if (err) {
                console.log('ERROR: .getUserById()');
                return reject(err);
            }

            return resolve(results[0]);
        });
    });
};

db.addNewUser = (uname, password, email, name, surname) => {

    return new Promise((resolve, reject) => {

        pool.query(`INSERT INTO Users (username, password, email, name, surname)VALUES (?, ?, ?, ?, ?);`, [uname, password, email, name, surname], (err) => {
            if (err) {
                console.log('ERROR: .addNewUser()');
                return reject(err);
            }

            return resolve({ message: 'new user added successfully' });
        });
    });
}

db.updateUser = (uid, uname, password, email , name, surname ) =>{

    return new Promise( (resolve, reject) => {

        pool.query(`UPDATE Users SET username = ? , password = ?, email = ?, name = ?, surname = ? WHERE uid= ? ;`, [uname, password, email, name, surname,uid], (err) => {
            if(err){
                console.log('ERROR: .updateUser()');
                return reject(err);
            }
            
            return resolve({ message: ' user updated successfully'});
        });
    });
}

//---TO-DO---
db.addNewLocalAdmin = (cuname, cpassword, cemail, atype) => {

    return new Promise((resolve, reject) => {

        pool.query(`INSERT INTO Users (username, password, email, usertype)VALUES (?, ?, ?, ?);`, [cuname, cpassword, cemail, atype], (err) => {
            if (err) {
                console.log('ERROR: .addNewLocalAdmin()');
                return reject(err);
            }

            return resolve({ message: 'new company added successfully' });
        });
    });
}

db.addNewCompany = (cuname, cname, caddress, imagePath) => {

    return new Promise((resolve, reject) => {

        pool.query(`SELECT * FROM Users WHERE username = ?`, [cuname], (err, results) => {


            if (err) {
                console.log('ERROR: .getUserById()');
                return reject(err);
            }

            var string = JSON.stringify(results);
            var json = JSON.parse(string);
            userID = json[0].uid;

            pool.query(`INSERT INTO Companies (name,adminId,companyAddress,imagePath)VALUES (?, ?, ?, ?);`, [cname, userID, caddress, imagePath], (err) => {
                if (err) {
                    console.log('ERROR: .addNewLocalAdmin()');
                    return reject(err);
                }

                return resolve({ message: 'new company added successfully' });
            });
        });
    });
}

db.getCompaines = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT A.username, A.email, A.password, B.name, B.companyAddress, B.id FROM Users AS A INNER JOIN Companies as B ON A.uid=B.adminId `, (err, results) => {
            if (err) {
                console.log('ERROR: .getCompanies()');
                return reject(err);
            }
            return resolve(results);
        });
    });
};


//return the company id and company name of a certain companyusername

db.getCompIDbyUsername = (uname) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT C.id, C.name FROM Companies AS C INNER JOIN Users as U ON C.adminId=U.uid AND U.username= ?`,[uname], (err, results) => { 
            if (err) {
                console.log('ERROR: .getCompanies()');
                return reject(err);
            }
            return resolve(results);
        });
    });
};


db.getEvents = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM Events`, (err, results) => {
            if (err) {
                console.log('ERROR: .getEvents()');
                return reject(err);
            }

            return resolve(results);
        });
    });
};

db.getEventById = (id) => {

    return new Promise( (resolve, reject) => {
        pool.query(`SELECT * FROM Events WHERE eId = ?`, [id] ,(err, results) => {
            if(err){
                console.log('ERROR: .getEventById()');

                return reject(err);
            }

            return resolve(results[0]);
        });
    });
};

db.addNewEvent = (compid,title, venue, date, time, capacity, detail,imagePath) => {
    return new Promise((resolve, reject) => {
        console.log(capacity);
        pool.query(`INSERT INTO Events (cId,remainingseat,title, venue, date, time, capacity,detail,status, imagePath)
                    VALUES(?,?,?,?, ?, ?, ?, ?, 'ACTIVE', ?);`
            , [compid,capacity,title, venue, date, time, capacity,detail,imagePath], (err, results) => {

                if (err) {
                    console.log('ERROR: .addNewEvent()');
                    return reject(err);
                }
                return resolve({ message: 'new event added successfully' });
            });
    });
};


//delete event
db.deleteEvent=(id)=>{

    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM Events WHERE eId = ?`, [id] ,(err, results) => {
                if (err) {
                    console.log('ERROR: .deleteEvent()');
                    return reject(err);
                }
                return resolve({ message: 'event successfully deleted'});
            });
    });
};


//get all tickets of a company
db.getEventByCompanyId = (id) => {

    return new Promise( (resolve, reject) => {
        pool.query(`SELECT * FROM Events WHERE cId = ?`, [id] ,(err, results) => {
            if(err){
                console.log('ERROR: .getEventByCompanyId');

                return reject(err);
            }

            return resolve(results);
        });
    });
};

/*Get all tickets of a customer */
db.getActiveTicketsById = (id) => {

    return new Promise( (resolve, reject) => {

    querystr=`SELECT E.eType as eventtype ,E.date as eventdate ,E.title, E.address as eventaddress,T.peoplenumber, T.createdAt as purchasedate , C.name as companyname
            FROM Tickets T JOIN Events E ON T.eId=E.eId JOIN Companies AS C ON C.id = E.cId 
            where T.userid=? and T.status='ACTIVE' ; ` ; 
        pool.query(querystr, [id] ,(err, results) => {
        if(err){
            console.log('ERROR: .getTicketsById()');

            return reject(err);
            }
        return resolve(results);
        });
    });
};

//decrease remaining capacity of event and create tickets for the user
db.addNewTicket = (userid,peoplenumber,eId) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE Events SET remainingseat = remainingseat - ? WHERE Events.eId =? ;
                    INSERT INTO Tickets (userid, peoplenumber,status, eId) VALUES( ?, ?, 'ACTIVE',?);`
            , [peoplenumber,eId ,userid,peoplenumber,eId], (err, results) => {

                if (err) {
                    console.log('ERROR: .addNewTicket()');
                    return reject(err);
                }
                console.log(results);
                return resolve({ message: 'ticket is purchased successfully' });
            });
    });
};




/*

*/
/* ****************  Login Authentication    ***************** */
//

db.authLogin = (uname, pass) => {

    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM Users WHERE username = ? AND password = ?`, [uname, pass], (err, results) => {
            if (err) {
                console.log('ERROR: .authLogin()');
                return reject(err);
            }
            //console.log(results);
            return resolve(results);
        });
    });
};


module.exports = db;