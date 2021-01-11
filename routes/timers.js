const express = require('express')
const router = express.Router()
const db = require('../database')

router.post('/timers/add', (req,res) => {
    let description = req.body.description
    let user_id = req.body.user_id

    db.one('insert into timers(description, user_id) values($1, $2) returning *', [description, user_id])
    .then( (result) => {
        res.status(200).send({success:"Successfully inserted new timer" + JSON.stringify(result)})
    })
    .catch( (err) => {
        res.status(500).send({error:"Error on /timers/add route" + JSON.stringify(err)})
    })
})

router.get('/timers/get', (req,res) => {

})


router.put('/timers/update', (req,res) => {

})

router.delete('/timers/delete', (req,res) => {

})


module.exports = router
