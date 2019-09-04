import express from 'express'

const SERVICE_PORT = process.env.PORT || 3000
const SERVICE_NAME = 'PRIMARY SERVICE'

const app = express()

app.get('/', (req: any, res: any) => {
  res.send('primary app says hi')
})

app.listen(SERVICE_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${SERVICE_PORT}`) // eslint-disable-line no-console
})
