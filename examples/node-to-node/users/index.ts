import express from 'express'
import axios from 'axios'
import { INTERNAL_PORT, SERVICE_NAME } from './constants'
import { BASE_URL as userServiceBaseUrl } from '../orders/constants'
import { USERS } from '../database'

const app = express()

app.get('/users/:userId', (req, res) => {
  const user = USERS.find(user => user.id === req.params.userId)
  if (!user) {
    return res.status(404).send('Could not find user')
  }

  return res.status(200).send(user.name)
})

app.get('/orders/:userId', async (req, res) => {
  const userId = req.params.userId
  const user = USERS.find(user => user.id === userId)
  if (!user) {
    return res.status(404).send('Could not find user')
  }

  let responseData
  try {
    const ordersResponse = await axios({
      baseURL: userServiceBaseUrl,
      url: `/orders/${userId}`,
    })
    responseData = ordersResponse.data
  } catch (error) {
    return res.status(error.response.status).send(error.response.data)
  }

  return res.status(200).json(responseData)
})

app.listen(INTERNAL_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${INTERNAL_PORT}`) // eslint-disable-line no-console
})
