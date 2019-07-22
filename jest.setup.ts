import { COLORS, ICONS, PROCESS_TEST_ENV } from './src/constants'

process.env.NODE_ENV = PROCESS_TEST_ENV

const deepClearObj = (o: object) =>
  Object.keys(o).forEach(k => (typeof o[k] === 'object' ? deepClearObj(o[k]) : (o[k] = '')))

// In order to simplify regex string-matching in tests, all text-styling is removed
deepClearObj(COLORS)
deepClearObj(ICONS)
