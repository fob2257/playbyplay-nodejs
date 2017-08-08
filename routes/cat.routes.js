var _ = require('lodash')

var Cat = require('../models/cat.model.js')

module.exports = function(app) {
    app.post('/cat', (req, res) => {
        var newCat = new Cat(req.body)
        newCat.save((err) => {
            if (err) {
                res.json({ 'info': 'error during cat create', 'error': err })
            } else {
                res.json({ 'info': 'cat created successfully' })
            }
        })
    });
    app.get('/cat', (req, res) => {
        Cat.find((err, cats) => {
            if (err) {
                res.json({ 'info': 'error during cat find', 'error': err })
            } else {
                res.json({ 'info': 'cats found!', 'data': cats })
            }
        })
    })
    app.get('/cat/:id', (req, res) => {
        Cat.findById(req.params.id, (err, cat) => {
            if (err) {
                res.json({ 'info': 'error during cat find id', 'error': err })
            } else {
                if (cat) {
                    res.json({ 'info': 'cat found by id!', 'data': cat })
                } else {
                    res.json({ 'info': 'cat not found' })
                }
            }
        })
    })
    app.put('/cat/:id', (req, res) => {
        Cat.findById(req.params.id, (err, cat) => {
            if (err) {
                res.json({ 'info': 'error during cat find id', 'error': err })
            }
            if (cat) {
                _.merge(cat, req.body)
                cat.save((err) => {
                    if (err) {
                        res.json({ 'info': 'error during cat update', 'error': err })
                    } else {
                        res.json({ 'info': 'cat info updated' })
                    }
                })
            } else {
                res.json({ 'info': 'cat not found' })
            }
        })
    })
    app.delete('/cat/:id', (req, res) => {
        Cat.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                res.json({ 'info': 'error during cat remove', 'error': err })
            } else {
                res.json({ 'info': `${req.params.id} the cat removed from Cat` })
            }

        })
    })
}