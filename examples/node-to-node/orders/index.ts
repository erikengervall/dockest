import express from 'express'
import { INTERNAL_PORT, SERVICE_NAME } from './constants'
import { ORDERS } from '../database'

const app = express()

app.get('/orders/:userId', (req, res) => {
  const userId = req.params.userId
  const orders = ORDERS.filter(order => order.userId === userId)
  if (orders.length === 0) {
    return res.status(404).send(`Could not find orders`)
  }

  return res.status(200).json({
    orders,
  })
})

app.listen(INTERNAL_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${INTERNAL_PORT}`) // eslint-disable-line no-console
})
