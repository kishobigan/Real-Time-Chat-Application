const mongoose = require('mongoose')

const DB_Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected')
    }catch (err) {
        console.error(`Error in database mongoDb Connection : ${err.message}`)
        process.exit(1);
    }
}

module.exports = DB_Connection