const createKafka = require('./index')

const main = async () => {
  const kafka = createKafka()

  return {
    kafka,
  }
}

module.exports = main
