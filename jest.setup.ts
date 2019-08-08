import { COLORS, PROCESS_TEST_ENV } from './src/constants'

process.env.NODE_ENV = PROCESS_TEST_ENV

const deepClearObj = (o: { [key: string]: any }) =>
  Object.keys(o).forEach(k => (typeof o[k] === 'object' ? deepClearObj(o[k]) : (o[k] = '')))

deepClearObj(COLORS) // In order to simplify regex string-matching in tests, all text-styling is removed
