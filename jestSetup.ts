import { COLORS } from './src/constants'

process.env.NODE_ENV = 'test'

const deepClearObj = (o: object) =>
  Object.keys(o).forEach(k => (typeof o[k] === 'object' ? deepClearObj(o[k]) : (o[k] = '')))

// In order to simplify regex string-matching in tests, the console-log colors are set to empty strings
deepClearObj(COLORS)
