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


db.getCategoryById = (id) => {

	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Categories WHERE categoryid = ?`, [id], (err, results) => {
			if (err) {

				return reject(err);
			}

			return resolve(results[0]);
		});
	});
};
db.getVenueById = (id) => {

	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Venues WHERE vid = ?`, [id], (err, results) => {
			if (err) {

				return reject(err);
			}

			return resolve(results[0]);
		});
	});
};

// TO-DO
db.addNewEvent = (compid, title, venue, date, time, type, detail, city, imagePath) => {
	return new Promise((resolve, reject) => {

		pool.query(`INSERT INTO Events (cId,title, venueId, date, time,detail,eType, city, status, imagePath)
                    VALUES(?,?,?,?,?,?,?,?, 'ACTIVE', ?);`
		, [compid, title, venue, date, time, detail, type, city, imagePath], (err, result) => {

			if (err) {

				return reject(err);
			}
			return resolve(JSON.stringify(result));
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

/* SEATCHART OF EVENTS*/

db.addNewSeat = (eid,colN,rowN,char,status) => {

	return new Promise((resolve, reject) => {

		pool.query(`INSERT INTO eventseats (eventId,rowId,columnId,symbol,status) VALUES (?, ?, ?, ?, ?);`, [eid,rowN,colN,char,status], (err) => {
			if (err) {
				return reject(err);
			}

			return resolve({ message: 'new seat has been created' });
		});
	});
};

db.addNewSeatRow = (eventId, seatRow,rowId) => {

	return new Promise((resolve, reject) => {

		pool.query(`INSERT INTO eventseatrows (eventid,rowid, rowstr) VALUES (?, ?, ?);`, [eventId, rowId, seatRow], (err) => {
			if (err) {
				return reject(err);
			}

			return resolve({ message: 'new seatrow added successfully' });
		});
	});
};

db.getSeatRowsByEventId = (eventId) => {

	return new Promise((resolve, reject) => {

		pool.query(`SELECT * FROM eventseatrows WHERE eventid= ? ORDER BY rowid ASC `, [eventId], (err,results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
			
		});
	});
};





db.UpdateSeatStatus = (eventId,rowId,colId,status) => {

	return new Promise((resolve, reject) => {

		pool.query(`UPDATE eventseats SET status = ? WHERE rowId=? AND columnId= ? AND eventId=? ; `, [status,rowId,colId,eventId], (err,results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};


db.getBookedSeats = (eventId) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT rowId,columnId FROM eventseats WHERE eventId=? AND status='booked' ; `, [eventId], (err,results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

db.getCategoryIdBySymbolAndEId = (symbol,eventId) =>{
	return new Promise((resolve, reject) => {

		pool.query(`SELECT * FROM Categories WHERE eventid= ? AND categorysymbol=?`, [eventId,symbol], (err,results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results[0]);
			
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

db.getAllCategoriesByEventId = async (eid) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Categories WHERE eventid = ?`, [eid], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

db.addCategory = (eid, cname, ccap, cprice,csymbol) => {

	return new Promise((resolve, reject) => {
		pool.query(`INSERT INTO Categories (eventid, categoryname, capacity, price, remaining, categorysymbol ) 
					VALUES (?,?,?,?,?,?);`, [eid, cname, ccap, cprice, ccap,csymbol], (err, result) => {

			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
};

db.deleteCategory = (categoryid) => {
	return new Promise((resolve, reject) => {
		pool.query(`DELETE FROM Categories WHERE categoryid = ?`, [categoryid], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve({ message: 'category successfully deleted' });
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
db.getTicketsByUserId = (id) => {

	return new Promise((resolve, reject) => {

		let querystr = `SELECT T.id, 
						T.status as status,
						T.peoplenumber,						
						E.eType as eventtype ,
						E.date as eventdate ,
						E.title as title,						 						 
						C.name as companyname,
						I.invoicepath as invoice,
						V.name as venue,
						Ct.categoryid as categoryid
		FROM Tickets AS T, 
		Events AS E, 
		Venues AS V,
		Companies AS C, 
		Categories AS Ct,
		Invoice AS I
		where T.userid=?  AND 		
		Ct.categoryid= T.categoryid AND 
		E.eID = Ct.eventid AND
		V.vid = E.venueId AND
		C.id = E.cID AND 
		I.tid = T.id ; ` ;

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
db.addNewTicket = (userid, peoplenumber, eId, cid,seatList) => {
	return new Promise((resolve, reject) => {
		pool.query(`
                    INSERT INTO Tickets (userid, peoplenumber,status, categoryid,seatlist, eventid) VALUES( ?, ?, 'ACTIVE',?, ?, ? );` ,
		[userid, peoplenumber, cid,seatList,eId], (err, results) => {
			if (err) {
				return reject(err);
			}
			console.log({ message: 'ticket is purchased successfully' });
			console.log(results);
			return resolve(results);
		});
	});
};

db.deleteTicket = (id, pnum, categoryid) => {

	return new Promise((resolve, reject) => {
		pool.query(`DELETE FROM Tickets WHERE id = ?;
					UPDATE Categories SET remaining = remaining + ? WHERE categoryid = ?`, [id, pnum, categoryid], (err, _results) => {
			if (err) {
				return reject(err);
			}
			return resolve({ message: 'ticket successfully deleted' });
		});
	});
};

/* SEATS*/

//*********************************
/**** Invoice ***/


db.getPriceFromCategory = (cid) => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT price FROM Categories WHERE categoryid = ?`,[cid], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

db.addNewInvoice = (ticketid,price) => {
	return new Promise((resolve, reject) => {
		pool.query(`
                    INSERT INTO Invoice (tid,type, price) VALUES( ?, 'Purchase',?);` ,
		[ticketid,price], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

db.getInoviceDetailsByTicketID =(tid)=>{
	return new Promise((resolve, reject) => {
		pool.query(`SELECT price FROM Categories WHERE categoryid = ?`,[cid], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});

};

db.setInvoicePath=(invoiceid,pdfpath)=>{
	return new Promise((resolve, reject) => {
		pool.query(`
                    UPDATE Invoice SET invoicepath=? WHERE iid=?;` ,
		[pdfpath,invoiceid], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
}

db.getCompanyDetailsByCompID =(cid)=>{
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Companies WHERE id = ?`,[cid], (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
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