// CRUD
const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const {MongoClient, ObjectID} = require('mongodb')

const usersCollectionName = 'users'
const tasksCollectionName = 'tasks'

const id = new ObjectID()
let db = null;

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
        name: 'Joe',
        age: 22
    },
    {
        name: 'Frieda',
        age: 34
    },
    {
        name: 'Sören',
        age: 43
    }
]

const run = async () => {

    const client = new MongoClient(connectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    try {
        const res = await client.connect()
        db = client.db(databaseName)

        // await insertData(tasksCollectionName, tasks, db)
        // await find(tasksCollectionName, {_id: new ObjectID('6015648a9502a1827f1201cd')}, db)
        // await find(tasksCollectionName, {completed: true}, db)
        // await update(tasksCollectionName, {completed: false}, {completed: true})
        await remove(tasksCollectionName , {description: '10th Task'})
    } catch (err) {
        console.log('Unable to connect to a database: ', err.message)
    } finally {
        await client.close()
    }
}

const find = async (collection, search) => {
    try {
        const result = await db.collection(collection).find(search).toArray()
        console.log(
            result
        )
    } catch (err) {
        console.log(`Unable to fetch: ${err.message}`)
    }
}

const insert = async (collection, data) => {
    try {
        const result = await db.collection(collection).insertMany(data)
        console.log(result.ops)
    } catch (err) {
        console.log(err.message || 'Could not insert document.')
    }
}

const update = async (collection, search, set) => {
    try {
        const result = await db.collection(collection).updateMany(
            search,
            {
                $set: set
            }
        )
        console.log(
            result
        )
    } catch (err) {
        console.log(err.message || 'Could not update documents.')
    }
}

const remove = async (collection, search) => {
    try {
        const result = await db.collection(collection).deleteMany(search)
        console.log(result.deletedCount)
        return result.deletedCount;
    } catch (err) {
        console.log(err.message || 'Could not delete documents.')
    }
}


run().then(() => {
    console.log('app ran...')
})
