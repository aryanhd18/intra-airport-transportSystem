const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 8080;

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'airport',

});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected');
  }
});

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors());

// Define a route for handling form submissions
app.post('/api/bookings', (req, res) => {
  const { route, departureTime, arrivalTime, dayOfWeek } = req.body;

  // Insert the form data into the database
  const query = 'INSERT INTO bookings (route, departureTime, arrivalTime, dayOfWeek) VALUES (?, ?, ?, ?)';
  db.query(query, [route, departureTime, arrivalTime, dayOfWeek], (err, result) => {
    if (err) {
      console.error('Database insertion error:', err);
      res.status(500).json({ error: 'Error occurred while inserting data into the database.' });
    } else {
      console.log('Booking created:', result);
      res.json({ message: 'Booking created successfully!' });
    }
  });
});

// Add a new route for viewing bookings
app.get('/view-bookings', (req, res) => {
    // Retrieve the booking data from the database
    const query = 'SELECT * FROM bookings';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database retrieval error:', err);
        res.status(500).json({ error: 'Error occurred while retrieving booking data from the database.' });
      } else {
        // Serve the booking data to the client
        res.json(results);
      }
    });
  });
  
// Define a route for handling user submissions
app.post('/api/users', (req, res) => {
  const { firstName, lastName, email, role } = req.body;

  //creating unique ids
  function generateUniqueID(existingIDs) {
    let newID;
    do {
      newID = Math.floor(Math.random() * 1000000); // Adjust the range as needed
    } while (existingIDs.includes(newID));
    return newID;
  }
  

  // Insert user data into the database
  const query = 'INSERT INTO users (first_name, last_name, email, role) VALUES (?, ?, ?, ?)';
  db.query(query, [firstName, lastName, email, role], (err, result) => {
    if (err) {
      console.error('Database insertion error:', err);
      res.status(500).json({ error: 'Error occurred while inserting data into the database.' });
    } else {
      console.log('User created:', result);
      res.json({ message: 'User created successfully!' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
