// CRUD
const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const { MongoClient, ObjectID } = require('mongodb')

const usersCollectionName = 'users'
const tasksCollectionName = 'tasks'

const id = new ObjectID()
console.log(id)
console.log(ObjectID(id).getTimestamp())

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

const users = [
    {
        _id: id,
        name: 'Massi',
        age: 50
    }
]

const run = async () => {

    const client = new MongoClient(connectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    await client.connect()
    const db = client.db(databaseName)

    try {
        await insertData(usersCollectionName, users, db)
        //await insertTasks(tasks)
    } catch (err) {
        console.log('Unable to connect to a database: ', err.message)
    } finally {
        await client.close()
    }
}

const insertData = async (collection, data, db) => {
    try {
        const result = await db.collection(collection).insertMany(data)
        console.log(result.ops)
    } catch (err) {
        console.log(err.message || 'Could not insert data.')
    }
}

run().then(() => {
    console.log('app started...')
})
