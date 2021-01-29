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
                db.any('insert into users (email, password, api_token) values ($1, $2, $3) returning *', [email,password,token])
                .then((insert_result)=>{
                    res.status(200).send({message:"Registered successfully.", token:token, user_id:insert_result[0].user_id})
                })
                .catch( err => {
                    throw new Error("Could not insert into users in register endpoint.")
                })
            }
            else {
                res.status(409).json({message:'Error. Attempted to register duplicate account.'})
            }
        })
        .catch((err) => {
            res.status(500).send({message:"Unknown server error during registration."})
        })
    }
    else {
        res.status(404).send({message:"Error. You require both an email and password to register."})
    }
})

module.exports = router
