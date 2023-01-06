const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./database/DB')

const app = express()
dotenv.config()

// database connection 
connectDB()


app.use(express.json())
app.use(express.urlencoded({extended:false}))


//bring in the routes 
const auth = require('./routes/UserRoute')

//mount the routes
app.use('/api/auth', auth)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`PORT STARTED ON: http://localhost:${PORT}`)
})