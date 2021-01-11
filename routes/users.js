const express = require('express')
const router = express.Router()
const db = require('../database')
//const pgp = require('pg-promise')()
//const db = pgp(process.env.DB_CONN_STRING)

/**
 * Create a user
 * Read a user (based on an email or, later, a oauth token)
 * Update a user
 * Delete a user (if a user deletes their account)
 */

router.post('/users/add', (req,res) => {
    let email = req.body.email
    let password = req.body.password
    let api_token = req.body.api_token
    db.none('insert into users (email, password, api_token) values ($1, $2, $3)', [email,password,api_token])
    .then(()=>{
        res.status(200).send('Hello world')
    })
    .catch( error => {
        if(error.constraint == 'unique_email_constraint') {
            console.log('Error. Attempt to insert user with duplicate email: ', error.detail)
            res.status(409).json({'error':'Error. Attempt to insert duplicate user: '+error.detail})
        }
        else {
            console.log('Unknown error. ', error)
            res.status(500).json({'Unknown error':'Error: '+error.detail})
        }  
    })
})

router.get('/users/get', (req,res)=> {
    let email = req.query.email
    db.one('select * from users where email = ($1)', [email])
    .then((result)=> {
        console.log("Got a result: " + JSON.stringify(result))
        res.status(200).send({result:result})
    })
    .catch(error => {
        console.log("Error: ", error.detail)
        res.status(500).send({'Unknown error':'An unknown error occurred: ' + error.detail})
    })
})

// TODO Will need to have purpose specific updates like, update password, update token etc which
// can be handled by registration routes
// TODO Look into serializing and deserializing REST data into User objects, etc
router.put('/users/update', (req,res) => {
    let email = req.body.email
    let new_api_token = req.body.new_api_token
    let new_password = req.body.new_password
    let new_email = req.body.new_email
    db.any('update users set email=($1),api_token=($2),password=($3) where users.email=($4) returning *', [new_email,new_api_token,new_password,email])
    .then((result) => {
        res.status(200).send({msg:"successfully update user with email " + email + " with values" + JSON.stringify(result)})
    })
    .catch((err)=> {
        res.status(500).send({error:"unknown error: " + err})
    })
})

router.delete('/users/delete', (req,res) => {
    let email = req.body.email
    db.any('delete from users where email = ($1) returning *', [email])
    .then((result) => {
        if(result.length > 0) res.status(200).json({msg:"Successfully deleted user: " + JSON.stringify(result)}) 
        else res.status(409).json({msg:"Could not delete user, there was no user with email: " + email})
    })
    .catch((err) => {
        res.status(500).json({error:"Error trying to delete a user: " + JSON.stringify(err)})
    })
})

module.exports = router
