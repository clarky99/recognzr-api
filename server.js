// require('dotenv').config();
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
        // host: process.env.DB_HOST,
        // user: process.env.DB_USER,
        // password: process.env.DB_SECRET,
        // database: process.env.DB_NAME,
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: true
        }
    }
})

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3000, () => {
    console.log(`app running on port ${process.env.PORT}`)
})

app.post('/signin', signin.handleSignIn(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt))

app.get('/profile/:id', profile.handleProfileGet(db))

app.put('/image', image.handleImage(db))

app.post('/imageurl', image.handleClarifai)
