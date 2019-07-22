export default (str: string, seperator: string = ' '): string => str.replace(/\s+/g, seperator).trim()
