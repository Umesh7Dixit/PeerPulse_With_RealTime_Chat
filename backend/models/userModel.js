import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    username:{
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        minLength:5,
        required: true,
    },

    profilePic:{
        type: String,
        default: "",
    },

    followers:{
        type: [String], //array of strings
        default: [],
    },

    following:{
        type: [String], //array of strings
        default: [],
    },

    bio: {
        type: String,
        default: "",
    },

    isFrozen: {
        type: Boolean,
        default: false,
    },

}, {timestamps:true/*this adds the created at and updated at fields*/, } 

);

//timestamps object is very good practice if we upload a new profile pic then it provide the time of created/updated at fiels
                            //here it is singular User and in mongoDB it becomes plural i.e users
const User = mongoose.model("User",userSchema); //User is a model

export default User;