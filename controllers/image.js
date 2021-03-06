const Clarifai = require('clarifai')

const clarifApiKey = process.env.API_CLARIFAI;
const app = new Clarifai.App({
  apiKey: clarifApiKey
});

const handleClarifai = (req, res) => {
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to reach Clarifai'))
}

const handleImage = (db) => (req, res) => {

    const { id } = req.body;
    
    db('users')
        .where({id})
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleClarifai
}