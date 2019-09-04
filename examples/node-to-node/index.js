const axios = require('axios') // eslint-disable-line @typescript-eslint/no-var-requires

const main = async () => {
  const result = await axios({
    baseURL: 'http://localhost:1337/',
    url: '/',
    method: 'GET',
  })

  return result
}

module.exports = main
