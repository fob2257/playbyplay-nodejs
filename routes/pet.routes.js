var async = require('async')
var redis = require('redis')
var passport = require('passport')
var authorize = require('../lib/authorize.js')()
var r = require('request').defaults({
    json: true
})

var client = redis.createClient(6379, '127.0.0.1');

module.exports = function (app) {
    app.get('/pets', authorize.authorize, (req, res) => {
        async.parallel({
            dog: (callback) => {
                client.get('http://localhost:3001/dog', (error, dog) => {
                    if (error) {
                        throw error
                    }
                    if (dog) {
                        callback(null, JSON.parse(dog))
                    } else {
                        r('http://localhost:3001/dog', function (error, response, body) {
                            if (error) {
                                callback({ service: 'dog', error: error })
                                return
                            }
                            if (!error && response.statusCode === 200) {
                                callback(null, body)
                                client.setex('http://localhost:3001/dog', 30, JSON.stringify(body), (error) => {
                                    if (error) {
                                        throw error
                                    }
                                })
                            } else {
                                callback(response.statusCode)
                            }
                        });
                    }
                })
            },
            cat: (callback) => {
                client.get('http://localhost:3000/cat', (error, cat) => {
                    if (error) { throw error }
                    if (cat) {
                        callback(null, JSON.parse(cat))
                    } else {
                        r('http://localhost:3000/cat', function (error, response, body) {
                            if (error) {
                                callback({ service: 'cat', error: error })
                                return
                            }
                            if (!error && response.statusCode === 200) {
                                callback(null, body)
                                client.set('http://localhost:3000/cat', JSON.stringify(body), (error) => {
                                    if (error) { throw error }
                                })
                            } else {
                                callback(response.statusCode)
                            }
                        });
                    }
                })

                // r('http://localhost:3000/cat', function (error, response, body) {
                //     if (error) {
                //         callback({ service: 'cat', error: error })
                //         return
                //     }
                //     if (!error && response.statusCode === 200) {
                //         callback(null, body)
                //     } else {
                //         callback(response.statusCode)
                //     }
                // });
            }
        },
            function (error, results) {
                res.json({
                    error: error,
                    results: results
                })
            })
    })
    app.post('/signup', passport.authenticate('local-signup'), signupPost)
    app.post('/login', passport.authenticate('local-login'), loginPost)
    app.get('/ping', authorize.authorize, ping)
}
ping = function (req, res) {
    res.json({ pong: true });
}
signupPost = function (req, res) {
    authorize.sendToken(req, res);
}
loginPost = function (req, res) {
    authorize.sendToken(req, res);
}