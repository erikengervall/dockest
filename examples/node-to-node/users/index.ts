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

  try {
    const result = await axios({
      baseURL: userServiceBaseUrl,
      url: `/orders/${userId}`,
    })

    return res.status(200).json({
      message: `${SERVICE_NAME} says hi`,
      result,
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      message: 'Something went very wrong',
      error,
    })
  }
})

app.listen(INTERNAL_PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${INTERNAL_PORT}`) // eslint-disable-line no-console
})
