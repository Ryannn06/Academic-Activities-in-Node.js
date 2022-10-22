const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000;


const bodyParser = require('body-parser');
const spawn = require("child_process").spawn;


const table_name = 'user_profile'

//app.use(express.bodyParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

//create connnection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password:'',
  database: 'project.js',
  multipleStatements: true
})

//check connection
connection.connect(function(err) {
  if (err) throw err;
  // if connection is successful
  console.log("Connection established!");
});


//homepage or the root route
app.get("/", (req, res) => {
  res.send('Hello, Everyone!');
});


//motion detector table
app.get("/motion_table", (req, res) => {
  console.log(req.query);
  var sql = `CREATE TABLE motiontime (motion_id int NOT NULL AUTO_INCREMENT, stime DATETIME, img LONGBLOB, PRIMARY KEY(motion_id))`
  
  connection.query( sql, function (err, results) {
    console.log(results);
      try {
        res.send('Table for Motion Time created!');
      } catch (err) {
        res.send(err + "error");
      }
    }
  );
});


//drop table
app.get("/drop_motion", (req, res) => {
  console.log(req.query);
  var sql = `DROP table motiontime`
  
  connection.query( sql, function (err, results) {
    console.log(results);
    try {
      res.send('Table for Motion deleted!');
    } catch (err) {
      res.send(err + "error");
    }
  }
  );
});


// Create 
app.post('/motion', (req, res)=> {
    var stime = req.body.stime;
    var img = req.body.img;

    var sql = `INSERT INTO motiontime (stime, img) VALUES (?, ?) `
    
    connection.query( sql,
        [
          stime,
          img
        ],
        function (err, results) {
          try {
            res.json({ data: [stime, img] });
          } catch (err) {
            res.send(Error, `${err}`);
          }
        }
      );
});

//READ
app.get("/motion", (req, res) => {
  var sql = `SELECT * FROM motiontime`
  
  connection.query( sql, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});