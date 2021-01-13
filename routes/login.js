const express = require('express')
const router = express.Router()
const db = require('../database')

//This needs to be much more robust.
//Need to look into secure forms of registration, password encryption etc.

//We can login with either the correct token OR a username and password
router.post('/login', (req,res) => {
    let email = req.body.email
    let password = req.body.password
    let api_token = req.body.api_token
    
    //If there's a token we (ideally) check it for validity then allow the user to login.
    //Validity means it exists in the database, AND the decryption of it should resolve to something meaningful.
    //If there's no token then we can try to log the user in with email and password.
    if(api_token) {
        console.log("there was an token", api_token)
        db.any('select * from users where api_token=$1', [api_token])
        .then((result)=>{
            if(result.length) {
                if(result[0].api_token == api_token) res.status(200).send({token_authorized:"Login Success, user had a valid token"})
                else res.status(401).send({invalid_token: "Login failure. Users token was unauthorized. Try email and password."})
            }
            else {
                res.status(404).send({invalid_token: "Token invalid. A valid token was not found in the user database."})
            }
        })
        .catch((err)=>{
            res.status(500).send({error: "An unknown error occurred trying to validate an api_token in the login endpoint => " + err.detail})
        })
    }

    else if(email && password) {
        db.any('select * from users where email=$1', [email])
        .then((result)=>{
            if(result.length) {
                if(result[0].password === password) res.status(200).send({success:"Registered successfully"})
                else res.status(401).send({unauthorized: "Unauthorized Access. Password did not match."})
            }
            else {
                res.status(404).send({notfound: "There was no user account with that e-mail."})
            }
        })
        .catch( err => {
            res.status(500).json({error:'Unknown error in login route => ' + err.detail})
        })
    }
    else {
        res.status(401).json({unauthorized:'Please. Login requires either a valid username/password or an authorized api_token'})
    }

})

module.exports = router
