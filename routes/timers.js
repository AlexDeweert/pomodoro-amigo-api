const express = require('express')
const router = express.Router()
const db = require('../database')

router.post('/timers/add', (req,res) => {
    let description = req.body.description
    let user_id = req.body.user_id
    let timer_id = req.body.timer_id
    let rank = req.body.rank
    console.log([description, user_id, timer_id, rank])
    db.one('insert into timers(description, user_id, timer_id, rank) values($1, $2, $3, $4) returning *', [description, user_id, timer_id, rank])
    .then( (result) => {
        res.status(200).send({success:"Successfully inserted new timer" + JSON.stringify(result), timer_id:result.timer_id})
    })
    .catch( (err) => {
        console.log(err)
        res.status(500).send({error:"Error on /timers/add route " + JSON.stringify(err.detail)})
    })
})

//We only want timers for specific user_ids
router.get('/timers/get', (req,res) => {
    let user_id = req.query.user_id
    if(user_id) {
        db.any('select * from timers where user_id = $1', [user_id])
        .then( (result)=> {
            res.status(200).send({result:result})
        })
        .catch( (error)=> {
            res.status(500).send({error:'Error on timers/get route ' + JSON.stringify(err.detail)})
        })
    }
    else {
        res.status(400).send({Error: 'Bad Request: Getting a user timer requires a user_id sent as a URL parameter'})
    }
})

//Requires a timer_id to update, can only upate description
router.put('/timers/update', (req,res) => {
    let timer_id = req.body.timer_id
    let new_description = req.body.description
    if(timer_id && new_description) {
        db.one('update timers set description=($2) where timer_id = $1 returning *', [timer_id, new_description])
        .then( (result)=> {
            res.status(200).send({success:'Successfully updated timer: ' + JSON.stringify(result)})
        })
        .catch((err)=>{
            res.status(500).send({error:'Unknown error trying to update a timer: ' + err})
        })
    }
    else {
        res.status(400).send({error:'Bad request: Updating a timer requires a timer_id and an updated description'})
    }
})

//Requires a timer_id to delete
router.delete('/timers/delete', (req,res) => {
    console.log("tried to delete with timer_id %s", req.body.timer_id)
    let timer_id = req.body.timer_id
    if(timer_id) {
        db.one('delete from timers where timer_id = $1 returning *', [timer_id])
        .then( (result)=> {
            res.status(200).send({success:'Successfully deleted timer: ' + JSON.stringify(result)})
        })
        .catch((err)=>{
            res.status(500).send({error:'Unknown error trying to delete a timer: ' + err})
        })
    }
    else {
        res.status(400).send({error:'Bad request: Deleting a timer requires a timer_id'})
    }
})


module.exports = router
