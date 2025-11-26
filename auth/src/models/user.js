import mongoose from "mongoose";

const User = new mongoose.Schema({
    Username: {
        type:String,
        required:true,
        trim:true,
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    Password:{
        type:String,
        required:true,
        trim:true
    },
    Token:{
        type:String
    },
    RefreshToken:{
        type:String
    },
    createdAt:Date,
    updatedAt:Date
},{
    timestamps:true
})


export default mongoose.model("User",User)