require('dotenv').config();
const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex')

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

app.post('/signin', (req, res) => {
    
    db.select('email','hash')
        .from('logins')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if (isValid) {
                db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            }
            else {
                res.status(400).json('Username and password combination invalid.')
            }
        })
        .catch(err => res.status(400).json('Username and password combination invalid.'))
})

app.post('/register', (req, res) => {

    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('logins')
        .returning('email')
        .then(loginEmail => {
            trx.insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .into('users')
            .returning('*')
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to Register.'))    

})

app.get('/profile/:id', (req, res) => {

    const { id } = req.params;

    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            }
            else {
                res.status(404).json('Not found')
            }
            })

})

app.put('/image', (req, res) => {

    const { id } = req.body;
    
    db('users')
        .where({id})
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
    .catch(err => res.status(400).json('unable to get entries'))

})
