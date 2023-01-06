const mongoose = require('mongoose')

// to avoid the deprecation error 
mongoose.set('strictQuery', true)

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.mongo_url)
    console.log(`mongodb connected: ${connection.connection.host}`)
}

module.exports = connectDB