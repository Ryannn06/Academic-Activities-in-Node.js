const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000;

const bodyParser = require('body-parser');

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
  )
})


// CREATE(insert)
app.post("/profiling", (req, res) => {
  const { fname, lname, address1, address2, phone, email } = req.body;

  const sql = `INSERT INTO user_profile ( fname, lname, address1, address2, phone, email ) VALUES (?,?,?,?,?,?)`
  
  connection.query( sql, [fname, lname, address1, address2, phone, email], (err, results) => {
      try {
        if (results.affectedRows > 0) {
          res.json({ message: "Data has been added!" });
        } else {
          res.json({ message: "Something went wrong." });
        }
      } catch (err) {
        res.json({ message: err });
      }

    }
  );
});

// READ (select)
app.get("/profiling", (req, res) => {
  const sql = `SELECT * FROM user_profile`

  connection.query( sql, (err, results) => {
    try {
      if (results.length > 0) {
        res.json(results);
      }
    } catch (err) {
      res.json({ message: err });
    }
  });
});

// DELETE
app.delete("/profiling", (req, res) => {
  const { id } = req.body;

  const sql = `DELETE FROM user_profile WHERE profile_id = ?`

  connection.query( sql, [profile_id], (err, results) => {
    try {
      if (results.affectedRows > 0) {
        res.json({ message: "Data has been deleted!" });
      } else {
        res.json({ message: "Something went wrong." });
      }
    } catch (err) {
      res.json({ message: err });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});