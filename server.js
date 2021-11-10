const express = require('express')
const PORT = 3000
const app = express()

app.use(express.static('.'))
app.listen(PORT, () => console.info(`listening on ${PORT}`));