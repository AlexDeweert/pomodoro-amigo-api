const express = require('express')
const router = express.Router()
const db = require('../database')

//This needs to be much more robust.
//Need to look into secure forms of registration, password encryption etc.
router.post('/register', (req,res) => {
    let email = req.body.email
    let password = req.body.password
    db.none('insert into users (email, password) values ($1, $2)', [email,password])
    .then(()=>{
        res.status(200).send({success:"Registered successfully"})
    })
    .catch( err => {
        if(err.constraint == 'unique_email_constraint') {
            res.status(409).json({error:'Attempted to register duplicate user'})
        }
        else {
            res.status(500).json({error:'Unknown error in registration => '+ err})
        }
    })
})

module.exports = router
