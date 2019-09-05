import axios from 'axios'
import { BASE_URL as usersBaseUrl } from './users/constants'

export const getUserNameById = async (userId: string) =>
  axios({
    baseURL: usersBaseUrl,
    url: `/users/${userId}`,
  })

export const getUserOrdersByUserId = async (userId: string) =>
  axios({
    baseURL: usersBaseUrl,
    url: `/orders/${userId}`,
  })
