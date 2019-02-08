// @ts-ignore
import { seedMovie } from './data.json'

const getFirstEntry = async () => ({}) // TODO: Implement

const main = async () => {
  const firstEntry = await getFirstEntry()

  return {
    firstEntry,
  }
}

export default main
