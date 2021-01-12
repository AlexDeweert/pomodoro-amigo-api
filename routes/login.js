const express = require('express')
const router = express.Router()
const db = require('../database')

//This needs to be much more robust.
//Need to look into secure forms of registration, password encryption etc.
router.post('/login', (req,res) => {
    let email = req.body.email
    let password = req.body.password
    let tempUser = {}
    if(email && password) {
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
