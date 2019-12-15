/* eslint-disable @typescript-eslint/no-var-requires */

const express = require('express')
const axios = require('axios')

const PORT = 1337
const SERVICE_NAME = 'node_to_node_users'

const USERS = [
  {
    id: '1',
    name: 'John Doe',
  },
]

const app = express()

app.get('/users/:userId', (req, res) => {
  const user = USERS.find(user => user.id === req.params.userId)

  if (!user) {
    return res.status(404).send('Could not find user')
  }

  res.status(200).json(user)
})

app.get('/orders/:userId', async (req, res) => {
  const userId = req.params.userId
  const user = USERS.find(user => user.id === userId)

  if (!user) {
    return res.status(404).send('Could not find user')
  }

  let response
  try {
    response = await axios({
      baseURL: `http://node_to_node_orders:1338/`,
      url: `/orders/${userId}`,
    })
  } catch (error) {
    return res.status(error.response.status).send(error.response.data)
  }

  return res.status(200).json(response.data)
})

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${PORT}`) // eslint-disable-line no-console
})
