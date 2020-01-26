var express = require ("express");
var path = require('path');
var methodOverride = require('method-override');
var bodyParser = require("body-parser");
let db = require("./database.js");
var app = express();

const port = 3000;
const ip = '127.0.0.1';


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.get('/',function(req,res){
	let sql = "SELECT * FROM Tagungsprogramm";
    let params = [];

	let today = new Date();
	let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	let dateTime = date+' '+time;

    db.all(sql,params,function(err,rows){
    	if (err){
    		 return console.error(err.message);
    	}else{
    		res.render("ubersicht", {input:rows,dateTime:dateTime});
    	}
    });
});

app.get('/hinweise', function(req, res){
	let sql = "SELECT * FROM Tagungsprogramm";
    let params = [];
    db.all(sql,params,function(err,rows){
    	if (err){
    		return console.error(err.message);
    	}else{
    		res.render("hinweise", {input:rows});
    	}
    });
});



app.get('/login', function(req,res){
	res.render("login");
});

app.post('/login', function(req,res){
	let email = req.body.email;
	let password = req.body.password;
	console.log("Email" + email);
	console.log("Password" + password);
	res.redirect("/mitarbeiter");
});

app.get('/mitarbeiter', function(req, res){
	res.render("mitarbeiter");
});

app.get('/tagung',function(req,res){
	let sql = "SELECT * FROM Tagungsprogramm";
    let params = [];
    db.all(sql,params,function(err,rows){
    	if (err){
    		 return console.error(err.message);
    	}else{
    		console.log("--------------------rows----------------");
    		console.log(rows);
    		res.render("tagung", {input:rows});
    	}
    });
});

app.get('/tagung/new',function(req,res){
	res.render("new");
});

app.get('/tagung/:id/edit',function(req,res){
	let sql = 'SELECT * FROM Tagungsprogramm WHERE id = ?';
	let params =[req.params.id]
   	db.get(sql,params,function(err,result){
   		if (err){
   			res.status(400).json({"error":res.message});
         	return;
   		}else{
   			res.render("edit",{input:result});
   		}
   	})
});

app.post('/tagung',function(req,res){
	let today = new Date();
	let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	
	let data = {name:req.body.name,
				beitrag:req.body.beitrag,
				redner:req.body.redner,
				raum:req.body.raum,
				zeitpunkt:req.body.zeitpunkt,
				tag:req.body.tag,
				datum:date
			}
	let sql = 'INSERT INTO Tagungsprogramm (name, beitrag, redner,raum,zeitpunkt,tag,datum) VALUES (?,?,?,?,?,?,?)';
	let params = [data.name, data.beitrag, data.redner, data.raum, data.zeitpunkt, data.tag, data.datum]; 
	db.run(sql,params,function(err,result){
		if(err){
			res.status(400).json({"error": err.message});
         	return;
		}else{
			/*res.json({
	        	"message": "success",
	         	"data": data,
	         	"id" : this.lastID
	      	});*/
	      	res.redirect("/tagung");
		}
	});

	
});

app.put('/tagung/:id',function(req,res){
	let today = new Date();
	let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

	let data = {name:req.body.name,
				beitrag:req.body.beitrag,
				redner:req.body.redner,
				raum:req.body.raum,
				zeitpunkt:req.body.zeitpunkt,
				tag:req.body.tag,
				datum:date
			}

	let sql = `UPDATE Tagungsprogramm set
         name = COALESCE(?, name),
         beitrag = COALESCE(?, beitrag),
         redner = COALESCE(?, redner),
         raum = COALESCE(?, raum),
         zeitpunkt = COALESCE(?, zeitpunkt),
         tag = COALESCE(?, tag),
         datum = COALESCE(?, datum)
         WHERE id = ?`

    let params = [data.name, data.beitrag, data.redner, data.raum, data.zeitpunkt, data.tag,data.datum, req.params.id]; 

    db.run(sql,params,function(err,result){
		if(err){
			res.status(400).json({"error": err.message});
         	return;
		}else{
			/*res.json({
	        	"message": "success",
	        	"data": data,
	        	"changes": this.changes
	      	});*/
	      	res.redirect("/tagung");
		}
	});
});

app.delete('/tagung/:id',function(req,res){
   db.run(
      'DELETE FROM Tagungsprogramm WHERE id = ?',
      req.params.id,
      function (err,result) {
        if (err) {
            res.status(400).json({"error": res.message})
            return;
        }else{
        	res.redirect("/tagung");
        }
        
   });
});

app.listen(port,ip,function(){
	console.log(`Server has started on port ${port}!`);
})
