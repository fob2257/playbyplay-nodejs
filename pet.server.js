var express = require('express')
var bodyParser = require('body-parser')
var passport = require('passport')
var mongoose = require('mongoose')
var app = express()

app.use(passport.initialize())
app.use(passport.session())

var options = {
    useMongoClient: true,
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
mongoose.connect('mongodb://localhost/users', options)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

var localStrategy = require('./lib/strategy.js')
var petRoutes = require('./routes/pet.routes.js')(app)
var errors = require('./lib/errors')(app)

var server = app.listen(3002, () => {
    console.log('pet.server running on port 3002')
})