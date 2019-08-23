export default (str: string, seperator = ' '): string => str.replace(/\s+/g, seperator).trim()
