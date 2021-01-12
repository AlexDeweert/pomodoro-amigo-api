const express=require('express')
if(process.env.NODE_ENV == 'development') {
    console.log("detected development environment")
    require('dotenv').config()
}
const app = express()

//Body parsing
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/users'))
app.use('/', require('./routes/timers'))
app.use('/', require('./routes/intervals'))
app.use('/', require('./routes/register'))
app.use('/', require('./routes/login'))

const port = process.env.API_LISTEN_PORT
app.listen(port, () => {
    console.log("ExpressJS App listening at port: " + port)
})
