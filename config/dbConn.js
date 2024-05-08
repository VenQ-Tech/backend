const mongoose = require('mongoose')
const connectDB = async () => {
  try {
    const ack=await mongoose.connect(process.env.DATABASE_URI,{
      dbName:'venqdb'
    });
    if(ack){
      console.log('connected to db sucessfully');
    }else{
      console.log('db connection failed');
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;