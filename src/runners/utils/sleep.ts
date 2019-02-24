export default (ms: number = 1000): Promise<number> =>
  new Promise(resolve => setTimeout(resolve, ms))
