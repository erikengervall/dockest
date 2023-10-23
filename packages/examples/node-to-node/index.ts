import axios from 'axios';

const USER_SERVICE_BASE_URL = `http://localhost:1337`;

export const getUserNameById = async (userId: string) => {
  const userResponse = await axios({
    baseURL: USER_SERVICE_BASE_URL,
    url: `/users/${userId}`,
  });

  return userResponse;
};

export const getOrdersByUserId = async (userId: string) => {
  const ordersResponse = await axios({
    baseURL: USER_SERVICE_BASE_URL,
    url: `/orders/${userId}`,
  });

  return ordersResponse;
};

export const notFound = async () => {
  const notFoundResponse = await axios({
    baseURL: USER_SERVICE_BASE_URL,
    url: `/not-found`,
  });

  return notFoundResponse;
};
