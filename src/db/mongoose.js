const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost:27017/task-manager-api'

const run = async () => {

    const User = mongoose.model('User', {
        name: {
            type: String
        },
        age: {
            type: Number
        }
    })

    const Task = mongoose.model('Task', {
        name: {
            description: String
        },
        completed: {
            type: Boolean
        }
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

    const me = new User({
        name: 'Massi',
        age: 50
    })

    const task1 = new Task({
        description: 'Task 1',
        completed: false
    })

    try {
        //const result = await me.save()
        const result = await task1.save()
        console.log(result)
    } catch (e) {
        console.log(e.message)
    }
}

run().then(() => {
    console.log('app ran...')
})