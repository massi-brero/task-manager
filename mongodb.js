// CRUD
const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const { MongoClient, ObjectID } = require('mongodb')

const usersCollectionName = 'users'
const tasksCollectionName = 'tasks'

const id = new ObjectID()

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

    try {
        await client.connect()
        const db = client.db(databaseName)

        //await insertData(usersCollectionName, users, db)
        //await insertTasks(tasks)
        await findUser(usersCollectionName, {name: 'Massi'}, db)
    } catch (err) {
        console.log('Unable to connect to a database: ', err.message)
    } finally {
        await client.close()
    }
}

const findUser = async (collection, search, db) => {
    try {
        const result = await db.collection(collection).findOne(search)
        console.log(result)
    } catch (err) {
        console.log(`Unable to fetch: ${err.message}`)
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
