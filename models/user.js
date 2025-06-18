const { strict } = require('assert');
const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({

       username:{
        type:String,
        require:true
       },
       contect:{
        type:Number,
        require:true,
        unique:true
       },
       password:{
        type:String,
        require:true
       },
       address:{
        type:String,
        required:true,
       },
       avatar:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
       },
       role:{
        type:String,
        default:"user",
        enum:["user","admin"],
       },
       favourites:[
        {
            type:mongoose.Types.ObjectId,
            ref:"books",
        },
       ],

       cart:[
        {
            type:mongoose.Types.ObjectId,
            ref:"books",
        },
       ],
       orders:[
        {
            type:mongoose.Types.ObjectId,
            ref:"orders",
        },
       ],
} , {timestamps:true});

module.exports = mongoose.model("user" , userSchema);