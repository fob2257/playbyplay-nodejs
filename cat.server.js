var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var options = {
  useMongoClient: true,
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

mongoose.connect('mongodb://localhost/cats', options)
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
 
var cats = require('./routes/cat.routes.js')(app);
 
app.listen(3000, () => {
    console.log('cat.server listening on port 3000')
})