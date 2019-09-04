const express = require('express') // eslint-disable-line @typescript-eslint/no-var-requires

const SERVICE_PORT = 8080
const SERVICE_NAME = 'DEPENDENCY SERVICE'

const app = express()

app.get('/', (req, res) => {
  res.send(`${SERVICE_NAME} app says hi`)
})

app.listen(SERVICE_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${SERVICE_PORT}`) // eslint-disable-line no-console
})
