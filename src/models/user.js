const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            const excludedWords = ['password']

            excludedWords.forEach(word => {
                if (value.toLowerCase().includes(word)) throw new Error(`Your password contains the excluded word "${word}"`)
            })
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Invalid email address.')
        }
    },
    age: {
        type: Number,
        default: 0,
        trim: true,
        validate(value) {
            if (value < 0) throw new Error('Age must be a positive number.')
        }
    }
})


userSchema.pre('save', async function (next) {
    const user = this

    console.log('before saving')

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User