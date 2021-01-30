const express = require('express')
const router = express.Router()
const db = require('../database')

router.post('/intervals/add', (req,res) => {
    let description = req.body.description
    let timer_id = req.body.timer_id
    let duration = req.body.duration
    let interval_id = req.body.interval_id

    db.one('insert into intervals(description, timer_id, duration, interval_id) values($1, $2, $3, $4) returning *', [description, timer_id, duration, interval_id])
    .then( (result) => {
        res.status(200).send({success:"Successfully inserted new interval" + JSON.stringify(result)})
    })
    .catch( (err) => {
        res.status(500).send({error:"Unknown error on /intervals/add => " + err})
    })
})

//We only want intervals for specific timer_id's
router.get('/intervals/get', (req,res) => {
    let timer_id = req.query.timer_id
    if(timer_id) {
        db.any('select * from intervals where timer_id = $1', [timer_id])
        .then( (result)=> {
            res.status(200).send({result:result})
        })
        .catch( (err)=> {
            res.status(500).send({error:'Error on intervals/get => ' + err})
        })
    }
    else {
        res.status(400).send({Error: 'Bad Request: Getting an interval requires a timer_id sent as a URL parameter'})
    }
})

//Requires an interval_id to update, can only upate description and duration
router.put('/intervals/update', (req,res) => {
    let interval_id = req.body.interval_id
    let new_description = req.body.description
    let new_duration = req.body.duration
    if(interval_id && new_description && new_duration) {
        db.one('update intervals set description=($2), duration=($3) where interval_id = $1 returning *', [interval_id, new_description, new_duration])
        .then( (result)=> {
            res.status(200).send({success:'Successfully updated interval: ' + JSON.stringify(result)})
        })
        .catch((err)=>{
            res.status(500).send({error:'Unknown error trying to update an interval: ' + err})
        })
    }
    else {
        res.status(400).send({error:'Bad request: Updating an interval requires an interval_id, description, and duration'})
    }
})

//Requires a interval_id to delete
router.delete('/intervals/delete', (req,res) => {
    let interval_id = req.body.interval_id
    if(interval_id) {
        db.one('delete from intervals where interval_id = $1 returning *', [interval_id])
        .then( (result)=> {
            res.status(200).send({success:'Successfully deleted interval: ' + JSON.stringify(result)})
        })
        .catch((err)=>{
            res.status(500).send({error:'Unknown error trying to delete an interval: ' + err})
        })
    }
    else {
        res.status(400).send({error:'Bad request: Deleting an interval requires an interval_id'})
    }
})


module.exports = router
