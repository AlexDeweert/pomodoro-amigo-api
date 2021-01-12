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

    if(api_token) {
        console.log("there was a token", api_token)
        //If there's a token we (ideally) check it for validity then allow the user to login.
        //Validity means it exists in the database, AND the decryption of it should resolve to something meaningful.

        //If there's no token then we can try to log the user in with email and password.
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
        res.status(401).json({unauthorized:'Please enter both a username and password'})
    }

})

module.exports = router
