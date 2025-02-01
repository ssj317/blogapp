const mongoose=require('mongoose');

const userschema=mongoose.Schema({

    fullName:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
    },

    password:{
        type:String,
        required:true,
    },

    profileImageURL:{
        type:String,
        default:'images/default.jpeg',
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },


},{timestamps:true});

module.exports=mongoose.model('user',userschema);
