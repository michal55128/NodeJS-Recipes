const { default :mongoose }=require("mongoose");

// import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL)
.then(()=>console.log('mongo db connected'))
.catch(err=>console.log(err.message));


