import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {type:String, required:true, unique:true},
        email: {type:String, required:true, unique:true},
        password: {type:String, required:true},   
    }
);
// u can also give obj to {username:{type:String,required:true,unique:true}}

const userModel = mongoose.model('user', userSchema);

export default userModel;
