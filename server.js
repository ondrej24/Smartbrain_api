const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const register = require('./controllers/register');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// connect to postgreSQL database

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('success');
})

// endpoint for user sign in and comparing the hashed password
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

// endpoint for registering the user and putting info to database
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// endpoint for displaying profile info
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

// endpoint for updating the entries after passing of the image
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// server listens to port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}` )
})