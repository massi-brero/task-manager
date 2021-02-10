const express = require('express')
const db = require('./db/dbHandle')
const dbUtils = require('./db/db.utils')
require('mongoose')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/:resource', async (req, res, next) => {

    try {
        let resource = dbUtils.getResource(req.params.resource)

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

app.get('/:resource', async (req, res) => {
    let resource = dbUtils.getResource(req.params.resource);
    try {
        const users = await resource.find()
        res.send(users)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

app.get('/:resource/:id', async (req, res) => {
    try {
        const id = req.params.id
        const resource = req.params.resource
        const user = await getResource(resource).findById(id)

        if (!user) {
            res.status(404)
        }

        res.send(user)
    } catch (e) {
        res.status(500).send(e.message)
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