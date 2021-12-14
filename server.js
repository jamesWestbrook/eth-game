const express = require('express')
const PORT = process.env.PORT
const app = express()

app.use(express.static('.'))
app.listen(PORT, () => console.info(`listening on ${PORT}`));