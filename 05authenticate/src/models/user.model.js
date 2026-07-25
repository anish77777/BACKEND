import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,   
    }
);
// u can also give obj to {username:{type:String,required:true,unique:true}}

const userModel = mongoose.model('user', userSchema);

export default userModel;
