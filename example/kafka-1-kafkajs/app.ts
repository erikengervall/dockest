import createKafka from './index'

const main = async () => {
  const kafka = createKafka()

  return {
    kafka,
  }
}

export default main
