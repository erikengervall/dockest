import axios from 'axios'
import { BASE_URL as usersBaseUrl } from './users/constants'

export const getUserNameById = async (userId: string) => {
  const userResponse = await axios({
    baseURL: usersBaseUrl,
    url: `/users/${userId}`,
  })

  return userResponse
}

export const getOrdersByUserId = async (userId: string) => {
  const ordersResponse = await axios({
    baseURL: usersBaseUrl,
    url: `/orders/${userId}`,
  })

  return ordersResponse
}

export const notFound = async () => {
  const notFoundResponse = await axios({
    baseURL: usersBaseUrl,
    url: `/not-found`,
  })

  return notFoundResponse
}
