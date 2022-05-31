const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, '請輸入您的名字']
        },
        password: {
            type: String,
            required: [true, '請輸入您的密碼'],
            select: false
        },
        email: {
            type: String,
            required: [true, '請輸入您的 Email'],
            unique: true,
            lowercase: true,
            select: false
        },
        photo: {
            type: String,
            default: ""
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
const User = mongoose.model('User', userSchema);

module.exports = User;
