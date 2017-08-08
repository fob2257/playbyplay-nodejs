var _ = require('lodash')

var Dog = require('../models/dog.model.js')

module.exports = function(app) {
    app.post('/dog', (req, res) => {
        var newDog = new Dog(req.body)
        newDog.save((err) => {
            if (err) {
                res.json({ 'info': 'error during dog create', 'error': err })
            } else {
                res.json({ 'info': 'dog created successfully' })
            }
        })
    });
    app.get('/dog', (req, res) => {
        Dog.find((err, dogs) => {
            if (err) {
                res.json({ 'info': 'error during dog find', 'error': err })
            } else {
                // res.json({ 'info': 'dogs found!', 'data': dogs })
                setTimeout(()=>{
                    res.json({ 'info': 'dogs found!', 'data': dogs })
                }, 10000)
            }
        })
    })
    app.get('/dog/:id', (req, res) => {
        Dog.findById(req.params.id, (err, dog) => {
            if (err) {
                res.json({ 'info': 'error during dog find id', 'error': err })
            } else {
                if (dog) {
                    res.json({ 'info': 'dog found by id!', 'data': dog })
                } else {
                    res.json({ 'info': 'dog not found' })
                }
            }
        })
    })
    app.put('/dog/:id', (req, res) => {
        Dog.findById(req.params.id, (err, dog) => {
            if (err) {
                res.json({ 'info': 'error during dog find id', 'error': err })
            }
            if (dog) {
                _.merge(dog, req.body)
                dog.save((err) => {
                    if (err) {
                        res.json({ 'info': 'error during dog update', 'error': err })
                    } else {
                        res.json({ 'info': 'dog info updated' })
                    }
                })
            } else {
                res.json({ 'info': 'dog not found' })
            }
        })
    })
    app.delete('/dog/:id', (req, res) => {
        Dog.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                res.json({ 'info': 'error during dog remove', 'error': err })
            } else {
                res.json({ 'info': `${req.params.id} removed from Dog` })
            }

        })
    })
}