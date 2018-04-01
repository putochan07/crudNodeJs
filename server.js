var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

app.use('/js',express.static(__dirname +'/node_modules/bootstrap/dist/js'));
app.use('/js',express.static(__dirname +'/node_modules/tether/dist/js'));
app.use('/js',express.static(__dirname +'/node_modules/jquery/dist/js'));
app.use('/css',express.static(__dirname +'/node_modules/bootstrap/dist/css'));

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "nodedb"
	
});

const siteTitle = "Simple Application";
const baseURL = "http://localhost:4000/";

//get data from the database
app.get('/',function(req,res){
	con.query("SELECT * from information",function(err,result){
		res.render('pages/index',{
			siteTitle: siteTitle,
			pageTitle: "Event List",
			items: result
		});
		//console.log(result);
	});
});
//insert data to the database
app.get('/event/add',function(req,res){
	
	res.render('pages/insertdata.ejs',{
		siteTitle: siteTitle,
		pageTitle: "Insert Data",
		items: ''
	});
});

app.post('/event/add',function(req,res){
	var query = "INSERT INTO `information`(id, name, homeadd, emailadd) VALUES (";
		query += "'"+req.body.id+"',";
		query += "'"+req.body.name+"',";
		query += "'"+req.body.homeadd+"',";
		query += "'"+req.body.emailadd+"')";

	con.query(query, function(err,result){
		res.redirect(baseURL);
	});
});

//get data based on ID
app.get('/event/edit/:id',function(req,res){
		con.query("SELECT * from information where id = '"+req.params.id+"'", function(err,result){
		res.render('pages/editdata',{
			siteTitle: siteTitle,
			pageTitle: "Edit data: " +result[0].name,
			items: result
		});
	});
});

app.post('/event/edit/:id',function(req,res){
	var query = "UPDATE information SET name = '"+req.body.name+"', homeadd = '"+req.body.homeadd+"' , emailadd = '"+req.body.emailadd+"' WHERE id = "+req.body.id+"";
	
		

	con.query(query, function(err,result){
		if(result)
		{
			res.redirect(baseURL);
		}
	});
});

app.get('/event/delete/:id',function(req,res){
		con.query("DELETE from information where id = '"+req.params.id+"'", function(err,result){
		if(result.affectedRows)
		{
			res.redirect(baseURL);
		}
		
	});
});


var server = app.listen(4000,function()
{
	console.log("Server started on 4000");
});