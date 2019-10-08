import { COLORS, PROCESS_TEST_ENV } from './packages/lib/src/constants'

const { keys } = Object

process.env.NODE_ENV = PROCESS_TEST_ENV

const deepClearObj = (o: { [key: string]: any }): any =>
  keys(o).forEach(k => (typeof o[k] === 'object' ? deepClearObj(o[k]) : (o[k] = '')))

deepClearObj(COLORS) // In order to simplify regex string-matching in tests, all text-styling is removed
