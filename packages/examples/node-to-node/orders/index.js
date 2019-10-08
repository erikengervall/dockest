/* eslint-disable @typescript-eslint/no-var-requires */

const express = require('express')

const PORT = 1338
const SERVICE_NAME = 'orders'

const ORDERS = [
  {
    userId: `1`,
    id: `1`,
    name: `An awesome product`,
  },
]

const app = express()

app.get('/orders/:userId', (req, res) => {
  const userId = req.params.userId
  const orders = ORDERS.filter(order => order.userId === userId)

  if (orders.length === 0) {
    return res.status(404).send(`Could not find orders`)
  }

  res.status(200).json({
    orders,
  })
})

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${PORT}`) // eslint-disable-line no-console
})
