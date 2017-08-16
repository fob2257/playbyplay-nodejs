var passport = require('passport')
var localStrategy = require('passport-local').Strategy
var User = require('../models/user.model.js')

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})

passport.use('local-login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, email, password, done) {
        process.nextTick(function () {
            User.findOne({ 'local.email': email.toLowerCase() }, function (err, user) {
                if (err) { return done(err) }
                var error = new Error()
                if (!user) {
                    error.custom = 'incorrect-username'
                    return done(error)
                }
                if (!user.validPassword(password)) {
                    error.custom = 'incorrect-password'
                    return done(error)
                } else {
                    return (null, user)
                }
            })
        })
    }))

passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, email, password, done) {
        process.nextTick(function () {
            User.findOne({ 'local.email': email.toLowerCase() }, function (err, existingUser) {
                if (err) { return done(err) }
                if (existingUser) {
                    var error = new Error()
                    error.custom = 'email-already-taken'
                    return done(error)
                }
                if (req.user) {
                    var user = req.user
                    user.local.email = email.toLowerCase()
                    user.local.password = user.generateHash(password)
                    user.save(function (err) {
                        if (err) { throw err }
                        return done(null, user)
                    })
                } else {
                    console.log('create')
                    var newUser = new User()
                    newUser.local.email = email
                    newUser.local.password = newUser.generateHash(password)

                    newUser.save(function (err) {
                        if (err) { throw err }
                        return done(null, newUser)
                    })
                }
            })
        })
    }))