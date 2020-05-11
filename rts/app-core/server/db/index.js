/* eslint-disable no-unused-vars */
const mysql = require('mysql');
let userID;

const pool = mysql.createPool({
	connectionLimit: 10,
	password: 'lomdyrob8p6pb56g',
	user: 'doadmin',
	database: 'reservations',
	host: 'cs308db-do-user-7358055-0.a.db.ondigitalocean.com',
	port: '25060',
	multipleStatements: true
});

let db = {};

/* USERS */

db.getAllUsers = () => {

	return new Promise((resolve, reject) => {

		pool.query(`SELECT * FROM Users`, (err, results) => {
			if (err) {
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
				return reject(err);
			}

			return resolve({ message: 'new user added successfully' });
		});
	});
};

db.updateUser = (uid, uname, password, email, name, surname) => {

	return new Promise((resolve, reject) => {

		pool.query(`UPDATE Users SET username = ? , password = ?, email = ?, name = ?, surname = ? WHERE uid= ? ;`, [uname, password, email, name, surname, uid], (err) => {
			if (err) {
				return reject(err);
			}

			return resolve({ message: ' user updated successfully' });
		});
	});
};

db.addNewLocalAdmin = (cuname, cpassword, cemail, atype) => {

	return new Promise((resolve, reject) => {

		pool.query(`INSERT INTO Users (username, password, email, usertype)VALUES (?, ?, ?, ?);`, [cuname, cpassword, cemail, atype], (err) => {
			if (err) {
				return reject(err);
			}

			return resolve({ message: 'new company added successfully' });
		});
	});
};

//get userid from companyid
db.getUserIDbyCompID = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT adminId FROM Companies WHERE id=?`, [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};


/* COMPANY */

db.addNewCompany = (cuname, cname, caddress, imagePath) => {

	return new Promise((resolve, reject) => {

		pool.query(`SELECT * FROM Users WHERE username = ?`, [cuname], (err, results) => {


			if (err) {
				return reject(err);
			}

			var string = JSON.stringify(results);
			var json = JSON.parse(string);
			userID = json[0].uid;

			pool.query(`INSERT INTO Companies (name,adminId,companyAddress,imagePath)VALUES (?, ?, ?, ?);`, [cname, userID, caddress, imagePath], (err) => {
				if (err) {

					return reject(err);
				}

				return resolve({ message: 'new company added successfully' });
			});
		});
	});
};

db.getCompaines = () => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT A.username, A.email, A.password, B.name, B.companyAddress, B.id, B.imagePath FROM Users AS A INNER JOIN Companies as B ON A.uid=B.adminId `, (err, results) => {
			if (err) {
				return reject(err);
			}
			//console.log(results);
			return resolve(results);
		});
	});
};

db.deleteCompany = (id) => {

	return new Promise((resolve, reject) => {
		pool.query(`DELETE FROM Users WHERE uid = ?`, [id], (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
};

db.getCompanyById = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT A.username, A.email, A.password, B.name, B.companyAddress, B.id, B.imagePath 
                    FROM Users AS A INNER JOIN Companies as B ON A.uid=B.adminId  
                    WHERE B.id = ?;`, [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			//console.log(results);
			return resolve(results[0]);
		});
	});
};

//return the company id and company name of a certain companyusername
db.getCompIDbyUsername = (uname) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT C.id, C.name FROM Companies AS C INNER JOIN Users as U ON C.adminId=U.uid AND U.username= ?`, [uname], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};


/* EVENTS */

db.getEvents = () => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Events`, (err, results) => {
			if (err) {
				return reject(err);
			}

			return resolve(results);
		});
	});
};

db.getEventById = (id) => {

	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Events WHERE eId = ?`, [id], (err, results) => {
			if (err) {

				return reject(err);
			}

			return resolve(results[0]);
		});
	});
};

// TO-DO
db.addNewEvent = (compid, title, venue, date, time, capacity, detail, imagePath) => {
	return new Promise((resolve, reject) => {
		console.log(capacity);
		pool.query(`INSERT INTO Events (cId,remainingseat,title, venue, date, time, capacity,detail,status, imagePath)
                    VALUES(?,?,?,?, ?, ?, ?, ?, 'ACTIVE', ?);`
		, [compid, capacity, title, venue, date, time, capacity, detail, imagePath], (err, result) => {

			if (err) {

				return reject(err);
			}
			return resolve(result.JSON());
		});
	});
};

//delete event
db.deleteEvent = (id) => {

	return new Promise((resolve, reject) => {
		pool.query(`DELETE FROM Events WHERE eId = ?`, [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve({ message: 'event successfully deleted' });
		});
	});
};

db.getEventByCompanyId = (id) => {

	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Events WHERE cId = ?`, [id], (err, results) => {
			if (err) {
				return reject(err);
			}

			return resolve(results);
		});
	});
};

db.getEventsbyType = (eventtype) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Events WHERE eType=?`, [eventtype], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

// eslint-disable-next-line no-unused-vars
db.searchEvents = (type, date, location, _text) => {
	//console.log(type, date, location);
	let d = new Date(date);
	let formatted_date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Events WHERE eType=? AND city=? AND date=?`, [type, location, formatted_date], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};


/* VENUE */

// TO-DO
db.addNewVenue = (compid, vname, capacity, imagepath) => {
	return new Promise((resolve, reject) => {

		pool.query(`INSERT INTO reservations.Venues (name, cid, imagePath, vcapacity) VALUES (?,?,?,?);`,
			[vname, compid, imagepath, capacity], (err, results) => {

				if (err) {

					return reject(err);
				}
				return resolve({ message: 'new venue added successfully' });
			});
	});
};

db.deleteVenue = (id) => {

	return new Promise((resolve, reject) => {
		pool.query(`DELETE FROM Venues WHERE vid = ?`, [id], (err, results) => {
			if (err) {
				console.log('ERROR: .deleteVenue()');
				return reject(err);
			}
			return resolve({ message: 'venue successfully deleted' });
		});
	});
};

db.getVenuesByCompanyId = (id) => {

	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Venues WHERE cid = ?`, [id], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

//TO-DO
db.getAllCategoriesByVenueId = async (vid) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Categories WHERE venueid = ?`, [vid], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

// TO-DO
db.addCategory = (vid, cname, ccap) => {

	return new Promise((resolve, reject) => {
		pool.query(`INSERT INTO Categories (venueid, cname, ccapacity) 
					VALUES (?, ?, ?);`, [vid, cname, ccap], (err, result) => {

			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
};


/* TICKET */

//get ticket by tid
db.getTicketById = (tid) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Tickets WHERE id = ?`, [tid], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results[0]);
		});
	});
};

// TO-DO
/*Get all tickets of a customer by user id */
db.getActiveTicketsById = (id) => {

	return new Promise((resolve, reject) => {

		let querystr = `SELECT T.id, E.eID as eid, T.userid as uid, E.eType as eventtype ,E.date as eventdate ,E.title,T.peoplenumber, T.createdAt as purchasedate , C.name as companyname
        FROM Tickets AS T, Events AS E, Companies AS C 
        where T.userid=? and T.status='ACTIVE' AND T.eId=E.eId ; ` ;

		pool.query(querystr, [id], (err, results) => {
			if (err) {

				return reject(err);
			}
			return resolve(results);
		});
	});
};

// TO-DO
//decrease remaining capacity of event and create tickets for the user
db.addNewTicket = (userid, peoplenumber, eId) => {
	return new Promise((resolve, reject) => {
		pool.query(`UPDATE Events SET remainingseat = remainingseat - ? WHERE Events.eId =? ;
                    INSERT INTO Tickets (userid, peoplenumber,status, eId) VALUES( ?, ?, 'ACTIVE',?);` ,
		[peoplenumber, eId, userid, peoplenumber, eId], (err, results) => {
			if (err) {
				return reject(err);
			}
			//console.log({ message: 'ticket is purchased successfully' });
			return resolve(results[1]);
		});
	});
};

db.deleteTicket = (id, _pnum, eid) => {

	return new Promise((resolve, reject) => {
		pool.query(`DELETE FROM Tickets WHERE id = ?;`, [id, eid], (err, _results) => {
			if (err) {
				return reject(err);
			}
			return resolve({ message: 'ticket successfully deleted' });
		});
	});
};

/* ****************  Login Authentication    ***************** */
//

db.authLogin = (uname, pass) => {

	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Users WHERE username = ? AND password = ?`, [uname, pass], (err, results) => {
			if (err) {
				return reject(err);
			}
			//console.log(results);
			return resolve(results);
		});
	});
};


module.exports = db;