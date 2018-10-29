'use strict';

const express = require('express')
const bodyParser = require('body-parser')

// Constants
const PORT = 8080
const jsonParser = bodyParser.json()

// App
const app = express()



// temporary initial values for scores
let weekly = [
    { name: 'ETH', score: 200 },
    { name: 'ETH', score: 190 },
    { name: 'ETH', score: 180 },
    { name: 'ETH', score: 170 },
    { name: 'ETH', score: 160 },
    { name: 'ETH', score: 150 },
    { name: 'ETH', score: 140 },
    { name: 'ETH', score: 130 },
    { name: 'ETH', score: 120 }
]

let allTime = [
    { name: 'ETH', score: 200 },
    { name: 'ETH', score: 190 },
    { name: 'ETH', score: 180 },
    { name: 'ETH', score: 170 },
    { name: 'ETH', score: 160 },
    { name: 'ETH', score: 150 },
    { name: 'ETH', score: 140 },
    { name: 'ETH', score: 130 },
    { name: 'ETH', score: 120 }
]

app.get('/leaders/:type', (req, res) => {

    let type = req.params['type']

    if (type === 'weekly') {
        return res.send(weekly)
    }

    if (type === 'allTime') {
        return res.send(allTime)
    }

    return res.send(400)
})

app.put('/leaders/:type', jsonParser, (req, res) => {

    let type = req.params['type']

    if (type === 'weekly') {
        weekly.push(req.body)
        return res.send(weekly)
    }

    if (type === 'allTime') {
        allTime.push(req.body)
        return res.send(allTime)
    }

    return res.send(400)
})


// Set up server
app.use(express.static('.'))
app.listen(PORT);