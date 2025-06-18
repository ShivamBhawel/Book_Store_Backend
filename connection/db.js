const mongoose = require('mongoose');


const url = process.env.mongodburl;
 mongoose.connect(url);

 const db = mongoose.connection;

 db.on('connected' , ()=> {

    console.log("Database is connected ");
 })

 db.on('disconnected',()=>{

    console.log("database disconnect");
 });

 db.on('error' , (error) => {

        console.log("internal server Error" , error);
 })