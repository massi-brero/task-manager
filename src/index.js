const User = require('./models/user')
const Task = require('./models/task')
const express = require('express')
const db = require('./db/dbHandle')
require('mongoose')
const app = express()
const port = process.env.PORT || 3000

const ENTITY_USER = 'users'
const ENTITY_TASK = 'tasks'

db.startDb()
app.use(express.json())

app.post('/:resource', async (req, res, next) => {

    try {
        let resource = req.params.resource;

        switch (resource) {
            case ENTITY_USER:
                resource = new User(req.body)
                break
            case ENTITY_TASK:
                resource = new Task(req.body)
                break
            default:
                throw new Error('No such entity.')
        }

        await resource.save();
        res
            .status(201)
            .send(resource)
    } catch (e) {
        res
            .status(400)
            .send(e.message)
    }
})

app.listen(port, () => {
    console.log(`server listening on ${port}`)
})