require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_SECRET,
        database: process.env.DB_NAME
    }
})

db.select('*').from('users').then(data => {
    console.log(data)
}).catch(console.log);

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3000, () => {
    console.log('app running on port 3000');
})

app.get('/' , (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt))

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db))

app.put('/image', (req, res) => image.handleImage(req, res, db))
