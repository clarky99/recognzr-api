const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.listen(3000, () => {
    console.log('app running on port 3000');
})

app.get('/' , (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success');
        }
    else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {

    const { email, name, password } = req.body;

    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })

    res.status(201).json(database.users[database.users.length - 1]);

})

app.get('/profile/:id', (req, res) => {

    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user)
        }
    if (!found) {
        res.status(404).json('No such user.')
    }
    })
})

app.put('/image', (req, res) => {

    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries)
        }
    if (!found) {
        res.status(404).json('No such user.')
    }
    })
})
