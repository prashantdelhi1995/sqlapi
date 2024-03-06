const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');


const app = express();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'nodecomplete',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(bodyParser.json());


//fetch all users
app.get('/get-user', (req, res) => {
  const query = 'SELECT * FROM users';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Error fetching users.' });
    }

    res.json(results);
  });
});

// add user
app.post('/add-user', (req, res) => {
  
  const { name, email, number } = req.body;

  if (!name || !email || !number) {
    return res.status(400).json({ error: 'Name, email, and number are required fields!' });
  }

  const query = 'INSERT INTO users (name, email, number) VALUES (?, ?, ?)';
  const values = [name, email, number];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error booking appointment:', err);
      return res.status(500).json({ error: 'Error booking appointment.' });
    }

    res.json({ message: 'Appointment booked successfully!' });
  });
});

// update user
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, number } = req.body;

  if (!name || !email || !number) {
    return res.status(400).json({ error: 'Name, email, and number are required fields!' });
  }

  const query = 'UPDATE users SET name = ?, email = ?, number = ? WHERE id = ?';
  const values = [name, email, number, id];

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating appointment:', err);
      return res.status(500).json({ error: 'Error updating appointment.' });
    }

    res.json({ message: 'Appointment updated successfully!' });
  });
});

// delete user
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';

  pool.query(query, id, (err, result) => {
    if (err) {
      console.error('Error deleting appointment:', err);
      return res.status(500).json({ error: 'Error deleting appointment.' });
    }

    res.json({ message: 'Appointment deleted successfully!' });
  });
});

app.listen(3000);
