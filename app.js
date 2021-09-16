var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mysql = require('mysql');

var app = express();
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var connection = mysql.createConnection({
  host     : 'mocktestfullstackrds.cqhh69nwmqsp.ap-southeast-1.rds.amazonaws.com',
  user     : 'momocloud',
  password : 'mothaiba',
  port     : 3306,
  database: 'rmittest'
});

//test connection
connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

//create a database
// connection.query("CREATE DATABASE IF NOT EXISTS rmittest", function(err, result){
//     if(err) throw err;
//     console.log("Database created");
// })

//create table if not exist
// connection.query("CREATE TABLE IF NOT EXISTS singers (id INT AUTO_INCREMENT, name VARCHAR(255), nickname VARCHAR(255), birthdate DATE, address VARCHAR(255), hitsongs VARCHAR(255), PRIMARY KEY (id))",
//     function(err, result){
//         if(err) throw err;
//         console.log("Table created")
//     }
// )

// connection.end();

app.get('/', (req, res, next) => {
    return res.json({
        hello: "hello world"
    })
})

app.get('/testing', (req, res, next) => {
    let query = "DELETE FROM singers WHERE name IS NULL";
    connection.query(query, ["haha", "momo", '1999-09-29', "haahsd", "song1 song2"], (err, results) => {
        if(err) return next(err);
        console.log("success add");
    })
    return res.json({
        test: Date.now()
    })
})

app.get('/singers', (req, res ,next) => {
    const query = "SELECT * FROM singers";
    connection.query(query, function(err, results){
        if(err) return next(err);
        else return res.json(results);
    })
})

app.get('/singers/:id' ,(req, res, next) => {
    const query = "SELECT * FROM singers WHERE id = " + req.params.id;
    connection.query(query, function(err, results){
        if(err) return next(err);
        else return res.json(results);
    })
})

app.post('/singers', (req, res, next) => {
    //id INT AUTO_INCREMENT, name VARCHAR(255), nickname VARCHAR(255), birthdate DATE, address VARCHAR(255), hitsongs VARCHAR(255)
    const name = req.body.name;
    const nickname = req.body.nickname;
    const birthdate = req.body.birthdate;
    const address = req.body.address;
    const hitsongs = req.body.hitsongs;

    let query = "INSERT INTO singers(name, nickname, birthdate, address, hitsongs) ";
    query += "VAlUES(?, ?, ?, ?, ?);";
    connection.query(query, [name, nickname, birthdate, address, hitsongs], function(err, result) {
        if(err) return next(err);
        return res.json({
            newid: result.insertId
        })
    })
})

app.delete('/singers/:id', (req, res, next) => {
    const query = "DELETE FROM singers WHERE id = ?";
    connection.query(query, [req.params.id], (err, result) => {
        if(err) return next(err);
        return res.json({
            affectedRows: result.affectedRows
        })
    })
})

app.put('/singers/:id', (req, res, next) => {
    const name = req.body.name;
    const nickname = req.body.nickname;
    const birthdate = req.body.birthdate;
    const address = req.body.address;
    const hitsongs = req.body.hitsongs;

    const query = "UPDATE singers SET name = ?, nickname = ?, birthdate = ?, address = ?, hitsongs = ? ";
    query += "WHERE id = " + req.params.id;
    connection.query(query, [name, nickname, birthdate, address, hitsongs], (err, result) => {
        if(err) return next(err);
        return res.json({
            result: "updated"
        })
    })
})

module.exports = app;
