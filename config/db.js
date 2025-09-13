const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const connecting = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('MongoDB is Connected');
    }catch(error){
        console.error('MongoDB connection error',error);
        process.exit(1);
    }
};

module.export = connectDB;