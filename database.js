'use strict';

let sqlite3 = require('sqlite3').verbose();
const DBName = "./database/Praktikum3_SWE.db";
let db = new sqlite3.Database(DBName,function(err){
	if (err){
		return console.error(err.message);
	}else{
		console.log('Database created!' + DBName);
		createTableTagungsprogramm();
		createTableMitarbeiter();
		readTableTagungsprogramm();
		readTableMitarbeiter();
	}
});

function createTableTagungsprogramm(){
	console.log("create database table");
	db.run(`CREATE TABLE Tagungsprogramm(
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			beitrag NUMERIC,
			redner TEXT,
			raum TEXT,
			zeitpunkt TEXT,
			tag TEXT,
			datum TEXT
		)`,function(err){
			if (err){
				return console.error(err.message);
			}else{
				console.log("Table just created, creating some rows");
				//insertTableTagungsprogramm();
			}
		});
}

function createTableMitarbeiter(){
	console.log("create database table");
	db.run(`CREATE TABLE Mitarbeiter(
			mitarbeiter_id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			vorname TEXT,
			email TEXT UNIQUE,
			password TEXT
		)`, function(err){
			if (err){
				return console.error(err.message);
			}else{
				console.log("Table just created, creating some rows");
			}
		});
}

function readTableTagungsprogramm(){
	let sql = `SELECT * FROM Tagungsprogramm`;
	let params = [];
	db.all(sql,params,function(err,rows){
		if (err){
			return console.error(err.message);
		}else{
			rows.forEach(function(row){
				console.log(row);
			});
		}
	});
}

function readTableMitarbeiter(){
	let sql = `SELECT * FROM Mitarbeiter`;
	let params = [];
	db.all(sql,params,function(err,rows){
		if (err){
			return console.error(err.message);
		}else{
			rows.forEach(function(row){
				console.log(row);
			});
		}
	});
}

/*function insertTableTagungsprogramm(){
	let sql =`INSERT INTO Tagungsprogramm (name, beitrag, redner, raum, zeitpunk, tag , datum) VALUES (?,?,?,?,?,?,?)`;
	let value = ["Test","20.5", "Redner Test", "BE02", "8-10", "Mittwoch","2019/12/26"];
	db.run(sql,value);
}*/

module.exports = db