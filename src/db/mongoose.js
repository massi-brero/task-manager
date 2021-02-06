const mongoose = require('mongoose')
const validator = require('validator')
const dbUrl = 'mongodb://localhost:27017/task-manager-api'

const run = async () => {



    const Task = mongoose.model('Task', {
        description: {
            type: String,
            trim: true,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    })

    const task1 = new Task({
        description: 'Test5   ',
        completed: true
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
        // const result = await me.save()
        const result = await task1.save()
        console.log(result)
    } catch (e) {
        console.log(e.message)
    }
}

run().then(() => {
    console.log('app started...')
})