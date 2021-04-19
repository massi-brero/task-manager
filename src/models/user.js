const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const constants = require('../shared/constants')
const Task = require('./task')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(value) {
        const excludedWords = ['password']

        excludedWords.forEach((word) => {
          if (value.toLowerCase().includes(word))
            throw new Error(
              `Your password contains the excluded word "${word}"`
            )
        })
      },
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error('Invalid email address.')
      },
    },
    age: {
      type: Number,
      default: 0,
      trim: true,
      validate(value) {
        if (value < 0) throw new Error('Age must be a positive number.')
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObj = user.toObject()

  delete userObj.password
  delete userObj.tokens

  return userObj
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, constants.SALT, {})

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  unableToLoginError(user)

  const isMatch = await bcrypt.compare(password, user.password)
  unableToLoginError(isMatch)

  return user
}

// hash plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.post('remove', async function () {
  const user = this
  await Task.deleteMany({
    owner: user._id,
  })
})

const unableToLoginError = (logCondition) => {
  if (!logCondition) {
    throw new Error(401)
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
