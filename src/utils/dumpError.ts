import fs from 'fs'

export default (payload: { [key: string]: any }) => {
  try {
    fs.writeFileSync(`${process.cwd()}/dockest-error.json`, JSON.stringify(payload, null, 2))
  } catch (error) {} // Swallow any potential errors
}
