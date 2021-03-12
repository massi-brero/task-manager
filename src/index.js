const express = require('express')
const db = require('./db/dbHandle')
const port = process.env.PORT || 3000
const app = express()
const ApiRouter = require('./routers/router-api')
const UserRouter = require('./routers/router-users')

app.use(express.json())
app.use(UserRouter)
app.use(ApiRouter)

app.listen(port, async () => {
    console.log(`server listening on ${port}`)

    try {
        await db.startDb()
    } catch (e) {
        console.log(e.message)
    }
})
