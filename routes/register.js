const express = require('express')
const router = express.Router()
const db = require('../database')
const {v4:uuid} = require('uuid');

//This needs to be much more robust.
//Need to look into secure forms of registration, password encryption etc.
router.post('/register', (req,res) => {
    console.log('something tried to register')
    let email = req.body.email
    let password = req.body.password
    
    console.log(email)
    console.log(password)

    if(email && password) {
        db.any('select exists(select 1 from users where email = $1)', [email])
        .then( (result)=> {
            let canRegister = !result[0].exists
            if(canRegister) {
                let token = uuid()
                db.none('insert into users (email, password, api_token) values ($1, $2, $3)', [email,password,token])
                .then(()=>{
                    res.status(200).send({success:"Registered successfully", token:token})
                })
                .catch( err => {
                    throw new Error("Could not insert into users in register endpoint. " + err)
                })
            }
            else {
                res.status(409).json({conflict:'Attempted to register duplicate user'})
            }
        })
        .catch((err) => {
            res.status(500).send({error:"Unknown error in registration => " + err})
        })
    }
    else {
        res.status(404).send({unauthorized:"Require both email and password to register for this service."})
    }
})

module.exports = router
