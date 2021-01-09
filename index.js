const express=require('express')
const app = express()
const port = 5000

app.get('/', (req,res) => {
    console.log("Something called the / route")
    res.send('Hello world')
})

app.listen(port, () => {
    console.log("ExpressJS App listening at port: " + port)
})
