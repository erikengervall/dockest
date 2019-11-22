import { COLORS } from './src/constants'

const { keys } = Object

const deepClearObj = (o: { [key: string]: any }): any =>
  keys(o).forEach(k => (typeof o[k] === 'object' ? deepClearObj(o[k]) : (o[k] = '')))

deepClearObj(COLORS) // In order to simplify regex string-matching in tests, all text-styling is removed
