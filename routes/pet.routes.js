var async = require('async')
var redis = require('redis')
var r = require('request').defaults({
    json: true
})

var client = redis.createClient(6379, '127.0.0.1');

module.exports = function (app) {
    app.get('/pets', (req, res) => {
        async.parallel({
            cat: (callback) => {
                r('http://localhost:3000/cat', function (error, response, body) {
                    if (error) {
                        callback({ service: 'cat', error: error })
                        return
                    }
                    if (!error && response.statusCode === 200) {
                        callback(null, body)
                    } else {
                        callback(response.statusCode)
                    }
                });
            },
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
            }
        },
            function (error, results) {
                res.json({
                    error: error,
                    results: results
                })
            }
        )
    })
    app.get('/ping', (req, res) => {
        res.json({ 'pong': Data.now() })
    })
}