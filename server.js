const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

require('dotenv').config()


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

console.log("database url: ", process.env.DATABASE_URL);

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
   	ssl: true
  }
});

const { Pool } = require('pg');
const itemsPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

itemsPool.query("SELECT 1").then(() => {
  console.log("PostgreSQL connected");
})
.catch((e) => {
  console.log("PostgreSQL not connected");
  console.error(e);
});


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('it is working...'));

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) });

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`app is running on port ${port}`);
})

/*
/ --> res = this is working...
/signin --> POST res = success/fail
/register --> POST res = user
/profile/:userId --> GET res = user
/image --> PUT res = user
*/