const handleRegister = (db, bcrypt) => (req, res) => {

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

}

module.exports = {
    handleRegister
}