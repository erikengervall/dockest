type sleep = (ms: number) => Promise<number>

const sleep: sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export { sleep }
