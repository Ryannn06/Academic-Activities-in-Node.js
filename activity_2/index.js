const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000;

const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

//app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ 
    secret: 'woody',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use(flash());

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
  res.sendFile('index.html', { root: __dirname});
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
  )
})


//insert user
app.get("/adduser", (req, res) => {
  console.log(req.query);
  var fname = req.query.fname;
  var lname = req.query.lname;
  var address1 = req.query.address1;
  var address2 = req.query.address2;
  var phone = req.query.phone;  
  var email = req.query.email;

  var sql = `INSERT INTO user_profile (fname, lname, address1, address2, phone, email) VALUES ("${fname}", "${lname}", "${address1}", "${address2}", "${phone}", "${email}")`;
  connection.query(sql,function (err, results) {
    try {
      res.send(`User ${req.query.fname} ${req.query.lname} has been added`);
    } catch (err) {
      res.send(err);
    }
  })
});



//update user
app.get("/updateuser", (req, res) => {
  console.log(req.query);
  const sql = `UPDATE user_profile SET fname = '${req.query.fname}', lname = '${req.query.lname}', address1 = '${req.query.address1}', address2 = '${req.query.address2}', phone = '${req.query.phone}', email = '${req.query.email}' WHERE profile_id = ?`;
  
  connection.query(sql, [req.query.profile_id], function (err, results) {
    console.log(results);
    try {
      res.send(`User ${req.query.fname} ${req.query.lname} has been updated`);
    } catch (err) {
      res.send(err);
    }
  }
  )
});


//delete user
app.get("/deleteuser", (req, res) => {
  console.log(req.query);

  const sql = "DELETE FROM user_profile WHERE profile_id = ?"
  connection.query( sql, [req.query.profile_id],function (err, results) {
    console.log(results);
    res.send("User has been deleted");
  }
  )
});


//insert profile with html
app.get("/create", (req, res) => {
  res.sendFile('create.html', { root: __dirname});
});


app.post("/submit", (req, res) => {
  console.log(req.body);

  const fname = req.body.fname;
  const lname = req.body.lname;
  const address1 = req.body.address1;
  const address2 = req.body.address2;
  const phone = req.body.phone;  
  const email = req.body.email;

  const sql = `INSERT INTO user_profile (fname, lname, address1, address2, phone, email) VALUES ("${fname}", "${lname}", "${address1}", "${address2}", "${phone}", "${email}")`;
   connection.query(sql,function (err, rows, fields) {
    try {
      res.redirect(`/create`);
    } catch (err) {
      res.send(err);
    }
  })
});   


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});