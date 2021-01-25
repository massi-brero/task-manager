// CRUD
const { MongoClient } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const usersCollectionName = 'users'
const tasksCollectionName = 'tasks'

const tasks = [
    {
        description: '10th Task',
        completed: true
    },
    {
        description: '11th Task',
        completed: false
    },
    {
        description: '12th Task',
        completed: true
    }
]

try {
    const client = new MongoClient(connectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    client.connect()

    const db = client.db(databaseName)

    const insertTasks = async (tasks) => {
        try {
            const result = await db.collection(tasksCollectionName).insertMany(tasks)
            console.log(result.ops)
        } catch (err) {
            console.log(err.message || 'Could not insert tasks.')
        } finally {
            await client.close()
        }
    }

    insertTasks(tasks)
} catch (err) {
    console.log('Unable to connect to a database: ', err.message)
}
