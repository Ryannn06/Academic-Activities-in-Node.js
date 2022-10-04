import requests
import mysql.connector

mydb = mysql.connector.connect({
	host: 'localhost',
	user:'root',
	password:'',
	database: 'project.js',
  multipleStatements: true
})

mycursor = mydb.cursor()

# Sample array
fname = 'Ryan'
lname = 'Angelo'

# Data that we will send in post request.
data = {'fname':fname, 'lname':lname}

# The POST request to our node server
res = requests.post('http://127.0.0.1:3000/adduser', json=data)

# Convert response data to json
returned_data = res.json()

print(returned_data)
result = returned_data['result']
print(result)
