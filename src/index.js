const express = require('express')
const db = require('./db/dbHandle')
const port = process.env.PORT || 3000
const app = express()
const ApiRouter = require('./routers/router-api')


app.use(express.json())
app.use(ApiRouter)

const bCrypt = require('bcryptjs')

const sec = async () => {
    const pw = 'red123456!'
    const hashedPw = await bCrypt.hash(pw, 8)

    console.log(pw)
    console.log(hashedPw)

    const isMatch = await bCrypt.compare('red123456!', hashedPw)
    console.log(isMatch)
}

// sec()

app.listen(port, async () => {
    console.log(`server listening on ${port}`)

    try {
        await db.startDb()
    } catch (e) {
        console.log(e.message)
    }
})
