import express from 'express'
import { INTERNAL_PORT, SERVICE_NAME } from './constants'
import { ORDERS } from '../database'

const app = express()

app.get('/orders/:userId', (req, res) => {
  const userId = req.params.userId
  const result = ORDERS.find(order => order.userId === userId)
  if (!result) {
    return res.status(404).send(`Couldn't find any orders related to user with id ${userId}`)
  }

  res.status(200).json({
    message: `${SERVICE_NAME} app says hi`,
    result,
  })
})

app.listen(INTERNAL_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${INTERNAL_PORT}`) // eslint-disable-line no-console
})
