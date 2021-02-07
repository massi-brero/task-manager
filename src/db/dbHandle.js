const db = require('mongoose')
const dbUrl = 'mongodb://localhost:27017/task-manager-api'

const startDb = async () => {
    try {
        await db.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (e) {
        console.log(e.message)
    }
}

module.exports.startDb = startDb