var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/dogs', { useMongoClient: true })
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
 
var dogs = require('./routes/dog.routes.js')(app);
 
app.listen(3001, () => {
    console.log('dog.server listening on port 3001')
})