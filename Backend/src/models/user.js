import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    username: {
        type: String,
        required:[true,"Username is required"],
        unique: true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    phone_number: {
        type: String,
        maxlength: 15
    },
    role: {
        type: String,
        enum: ['citizen', 'administrator', 'professional'],
        required: true
    },
    address: {
        type: String,
        lowercase: true,
        maxlength: 255
    },
    refreshToken:{
        type:String,
    },
},{
    timestamps:true
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
        },process.env.ACESS_TOKEN_SECRET,process.env.ACESS_TOKEN_EXPIRY);
}

userSchema.methods.generateRefreshToken = function(){   
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
}


export const User = mongoose.model("User", userSchema);