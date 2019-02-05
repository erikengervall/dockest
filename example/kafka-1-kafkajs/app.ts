import createKafka from './index'

const main = () => {
  const kafka = createKafka()

  return {
    kafka,
  }
}

export default main
