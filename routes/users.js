var express = require('express')
var router = express.Router()
var pgp = require('pg-promise')()
var db = pgp(process.env.DB_CONN_STRING)

/**
 * Create a user
 * Read a user (based on an email or, later, a oauth token)
 * Update a user
 * Delete a user (if a user deletes their account)
 */

router.post('/create', (req,res) => {
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

router.get('/read', (req,res)=> {
    let email = req.query.email
    let token = req.query.token
    console.log(token)
    db.one('select * from users where email = ($1)', [email])
    .then((result)=> {
        console.log("Got a result: " + JSON.stringify(result))
        res.status(200).send({'Success':'Got user ' + JSON.stringify(result)})
    })
    .catch(error => {
        console.log("Error: ", error.detail)
        res.status(500).send({'Unknown error':'An unknown error occurred: ' + error.detail})
    })
})

module.exports = router