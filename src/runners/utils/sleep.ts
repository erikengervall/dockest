const sleep = (ms: number = 1000): Promise<number> =>
  new Promise(resolve => setTimeout(resolve, ms))

export default sleep
