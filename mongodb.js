// CRUD
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


mongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) {
        console.log('Unable to connect to a database')
        return
    }

    const db = client.db(databaseName)
    const usersCollectionName = 'users'
    const tasksCollectionName = 'tasks'

    const tasks = [
        {
            description: '4th Task',
            completed: true
        },
        {
            description: '5th Task',
            completed: false
        },
        {
            description: '6th Task',
            completed: true
        }
    ]

    const insertTasks = async (tasks) => {
        try {
            const result = await db.collection(tasksCollectionName).insertMany(tasks)
            console.log(result.ops)
        } catch (err) {
            console.log(err.message || 'Could not insert tasks.')
        } finally {
            //client.close()
        }
    }

    insertTasks(tasks)

    // db.collection('users').insertOne({
    //     name: 'Frieda',
    //     age: '18'
    // }, (err, result) => {
    //     if (err) {
    //         console.log('error when inserting user...')
    //         return
    //     }
    //
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Massi',
    //         age: '28'
    //     },
    //     {
    //         name: 'Joe',
    //         age: '19'
    //     },
    // ], (err, result) => {
    //     if (err) {
    //         console.log('error when inserting users...')
    //         return
    //     }
    //
    //     console.log(result.ops)
    // })
})
