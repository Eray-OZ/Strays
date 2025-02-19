import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import validator from 'validator'



const petSchema = mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
        maxLength: 11
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
},
    { timestamps: true })

export const Pet = mongoose.model('Pet', petSchema)





const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username area is required'],
    },
    email: {
        type: String,
        required: [true, 'Email area is required'],
        validate: [validator.isEmail, 'Valid email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password area is required'],
        minLength: [4, 'At least 4 characters'],
    }
},
    { timestamps: true })


userSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash
        next()
    })
})

export const User = mongoose.model('User', userSchema);

