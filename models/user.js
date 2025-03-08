const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//1-create Schema
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true,'Username required'],
        unique:[true,'Username unique'],
    },
    email:{
        type: String,
        required:[true,'email required'],
        unique:[true,'email unique'],
    },
    password:{
        type: String,
        required:[true,'password required'],
    },
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


//2-create model
const User= mongoose.model('User',userSchema);

module.exports = User;