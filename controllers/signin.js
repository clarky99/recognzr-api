const handleSignIn = (db, bcrypt) => (req, res) => {
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
}

module.exports = {
    handleSignIn
}