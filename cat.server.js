var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/cats', { useMongoClient: true })
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
 
var cats = require('./routes/cat.routes.js')(app);
 
app.listen(3000, () => {
    console.log('cat.server listening on port 3000')
})