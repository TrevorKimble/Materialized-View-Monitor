const express = require(`express`)
require(`dotenv`).config()

const hostname = process.env.host
const port = process.env.port

const api = express()

// CORS middleware
api.use((req, res, next) => {
    res.setHeader(`Access-Control-Allow-Origin`, `http://${process.env.host}:7201`)
    res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, OPTIONS`)
    res.setHeader(`Access-Control-Allow-Headers`, `Content-Type`)
    next()
})

api.use(express.json())
api.use(`/data`, require(`./getData`))

if (process.env.NODE_ENV !== `test`) {
    api.listen(port, () => console.log(`Server running at http://${hostname}:${port}/`))
}

module.exports = api