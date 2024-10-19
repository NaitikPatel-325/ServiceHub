import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone_number: {
        type: String,
        maxlength: 15,
        required: [true, "Phone number is required"],
    },
    role: {
        type: String,
        enum: ['citizen', 'government', 'professional'],
        default: 'citizen'
    },
    address: {
        type: String,
        lowercase: true,
        maxlength: 255
    },
    refreshToken: {
        type: String,
    },
    avatar: {
        type: String,
        default: "",
        required: true
    },
    certificate: {
        type: String,
        default: ""
    },
    professionType: { 
        type: String,
        default: ""
    },
    experience: {  
        type: Number,
        default: 0
    },
    professionStatus: { 
        type: String,
        enum: ['citizenPending','pending', 'approved', 'rejected'],
        default: 'citizenPending'
    },
    professionDescription: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
    console.log(this.password);
    next();
})  

userSchema.methods.passwordCheck = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },process.env.ACCESS_TOKEN_SECRET,{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}


export const User = mongoose.model("User", userSchema);