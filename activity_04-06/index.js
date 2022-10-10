const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000;


const bodyParser = require('body-parser');
const spawn = require("child_process").spawn;


const table_name = 'user_profile'

//app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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


//get all users
app.get("/allprofiles", (req, res) => {
  console.log(req.query);
  var sql = 'SELECT * FROM user_profile'
  connection.query(sql, function(err, tables){
    console.log(tables);
    //check if there are results
    try {
      for (let i = 0; i < tables.length; i++){
        var name = `${tables[i].profile_id}`+ ' ' + `${tables[i].fname}` + ' ' + `${tables[i].lname}` + ' ' + `${tables[i].address1}` + ' ' + `${tables[i].address2}` + ' ' + `${tables[i].phone}` + ' ' + `${tables[i].email}\n`
        res.write(name)
      }
      res.end()
    } catch (err) {
      res.send('Error: ${err}');
    }
  });
});


//first create table
app.get("/create_userprofile", (req, res) => {
  console.log(req.query);
  connection.query(
    "CREATE TABLE user_profile (profile_id int NOT NULL AUTO_INCREMENT, fname VARCHAR(240), lname VARCHAR(240), address1 VARCHAR(255), address2 VARCHAR(255), phone VARCHAR(11), email VARCHAR(150), PRIMARY KEY(profile_id))",
  function (err, results) {
    console.log(results);
    try {
      res.send('Table for User Profile created!');
    } catch (err) {
      res.send(err + "error");
    }
  }
  );
});


//drop table
app.get("/drop_userprofile", (req, res) => {
  console.log(req.query);
  var sql = `DROP table user_profile`
  
  connection.query( sql, function (err, results) {
    console.log(results);
    try {
      res.send('Table for User Profile deleted!');
    } catch (err) {
      res.send(err + "error");
    }
  }
  );
});


// Create
app.post('/profiling', (req, res)=> {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var phone = req.body.phone;
    var email = req.body.email;

    var sql = `INSERT INTO ${table_name} (fname, lname, address1, address2, phone, email) VALUES (?, ?, ?, ?, ?, ?)`
    
    connection.query( sql,
        [
          fname,
          lname,
          address1,
          address2,
          phone,
          email
        ],
        function (err, results) {
          try {
            res
            res.json({ data: [fname, lname, address1, address2, phone, email] });
          } catch (err) {
            res.send(Error, `${err}`);

          }
        }
      );
});


//READ
app.get("/profiling", (req, res) => {
  var sql = `SELECT * FROM ${table_name}`
    connection.query( sql, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  });



//UPDATE
app.put("/profiling", (req, res) => {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var phone = req.body.phone;
    var email = req.body.email;
    var profile_id = req.body.profile_id;

    var sql = `UPDATE ${table_name} SET fname=?, lname=?, address1=?, address2=?, phone=?, email=? WHERE profile_id=?`

  connection.query(
    sql,
    [
      fname,
      lname,
      address1,
      address2,
      phone,
      email,
      profile_id
    ],
    function (err, results) {
      try {
        res.json({ data: [ profile_id, fname, lname, address1, address2, phone, email] });
      } catch (err) {
        res.send(Error, `${err}`);
      }
    }
  );
});


//DELETE
app.delete("/profiling", (req, res) => {
    var profile_id = req.body.profile_id;

   var sql = `DELETE FROM ${table_name} WHERE profile_id=?`
    connection.query(sql, [profile_id], function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


//motion detector table
app.get("/motion_table", (req, res) => {
  console.log(req.query);
  var sql = `CREATE TABLE motiontime (motion_id int NOT NULL AUTO_INCREMENT, stime DATETIME, ftime DATETIME, PRIMARY KEY(motion_id))`
  
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


//motion detector table with string date
app.get("/motions_table", (req, res) => {
  console.log(req.query);
  var sql = `CREATE TABLE motiontimes (motion_id int NOT NULL AUTO_INCREMENT, stime VARCHAR(30), ftime VARCHAR(30), PRIMARY KEY(motion_id))`
  
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


// Create 
app.post('/motion', (req, res)=> {
    var stime = req.body.stime;
    var ftime = req.body.ftime;

    var sql = `INSERT INTO motiontimes (stime, ftime) VALUES (?, ?) `
    
    connection.query( sql,
        [
          stime,
          ftime
        ],
        function (err, results) {
          try {
            res
            res.json({ data: [stime, ftime] });
          } catch (err) {
            res.send(Error, `${err}`);
          }
        }
      );
});

//READ
app.get("/motion", (req, res) => {
  var sql = `SELECT * FROM motiontimes`
  
  connection.query( sql, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
// Create 
app.post('/motion', (req, res)=> {
    var stime = req.body.stime;
    var ftime = req.body.ftime;

    var sql = `INSERT INTO motiontime (stime, ftime) VALUES ( STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s.mmmmmm'), STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s.mmmmmm') ) `
    
    connection.query( sql,
        [
          stime,
          ftime
        ],
        function (err, results) {
          try {
            res
            res.json({ data: [stime, ftime] });
          } catch (err) {
            res.send(Error, `${err}`);
          }
        }
      );
});
*/