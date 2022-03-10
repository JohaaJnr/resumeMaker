const mongoose = require('mongoose')

const connect = async() =>{
   try{
    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDb connected successfully on host: ${connection.connection.host}`)
   }catch(err){
    console.error(err)
   }
    
}

module.exports = connect