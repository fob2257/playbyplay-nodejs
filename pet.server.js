var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

var petRoutes = require('./routes/pet.routes.js')(app)

var server = app.listen(3002, () => {
    console.log('pet.server running on port 3002')
})