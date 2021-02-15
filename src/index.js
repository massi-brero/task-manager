const express = require('express')
const db = require('./db/dbHandle')
const dbUtils = require('./db/db.utils')
require('mongoose')
const app = express()
const port = process.env.PORT || 3000
const resources = ['users', 'tasks']

app.use(express.json())

app.post('/:resource', async (req, res) => {

    try {

        try {
            let resource = dbUtils.getResource(req).save();

            res
                .status(201)
                .send(resource)
        } catch (e) {
            res
                .status(400)
                .send(e.message)
        }
    } catch (e) {
        res
            .status(400)
            .send(e.message)
    }
})

app.get('/:resource', async (req, res) => {

    try {
        let result = await dbUtils.getResource(req).find()
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


app.get('/:resource/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await dbUtils.getResource(req).findById(id)

        res.send(result)

        if (!result) {
            return res.status(404)
        }

    } catch (e) {
        res.status(500).send(e.message)
    }
})

app.put('/:resource/:id', async (req, res) => {
    const resource = req.params.resource
    const updates = Object.keys(req.body)
    const allowedUpdates = {
        users: ['name', 'password', 'name', 'age'],
        tasks: ['description', 'completed'],
    }

    if (resources.includes(resource)) {
        res.status(400).send({
            error: 'No such resource'
        })
    }

    const isValidUpdate = updates.every((prop) => allowedUpdates[resource].includes(prop))
    if (!isValidUpdate) {
        res.status(400).send({
            error: 'Invalid updates!'
        })
    }


    const options = {
        new: true,
        runValidators: true
    }
    try {
        const result = await dbUtils.getResource(req).findByIdAndUpdate(
            req.params.id,
            req.body,
            options
        )

        if (!result) {
            return res.status(404).send()
        }

        res.send(result)

    } catch (e) {
        res.status(422).send(e.message)
    }
})

app.listen(port, async () => {
    console.log(`server listening on ${port}`)

    try {
        await db.startDb()
    } catch (e) {
        console.log(e.message)
    }
})