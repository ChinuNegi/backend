import mongoose from "mongoose"
import mongooseUniqueValidator from "mongoose-unique-validator";
var userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        unique:true,
        lowercase:true
    },
    mobile:{
        type:String,
        required:[true,"mobile is required"],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true,
        
    },
    token:{
        type:String,
        default:""
    }
   
});
userSchema.plugin(mongooseUniqueValidator)
var userSchemaModel=mongoose.model("userDetails",userSchema);
export default userSchemaModel;