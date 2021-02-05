const mongoose = require('mongoose')
const validator = require('validator')
const dbUrl = 'mongodb://localhost:27017/task-manager-api'

const run = async () => {

    const User = mongoose.model('User', {
        name: {
            type: String,
            trim: true,
            required: true
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


    const me = new User({
        name: '   Jeff  ',
        email: 'Jeff@fritze.de',
        age: 23
    })

    const Task = mongoose.model('Task', {
        name: {
            description: String
        },
        completed: {
            type: Boolean
        }
    })

    const task1 = new Task({
        description: 'Task 1',
        completed: false
    })

    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (e) {
        console.log(e.message)
    }

    try {
        const result = await me.save()
        //const result = await task1.save()
        console.log(result)
    } catch (e) {
        console.log(e.message)
    }
}

run().then(() => {
    console.log('app started...')
})