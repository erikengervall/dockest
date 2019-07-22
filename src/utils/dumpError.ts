import fs from 'fs'

export default (payload: { [key: string]: any }) =>
  fs.writeFileSync(`${process.cwd()}/dockest-error.json`, JSON.stringify(payload, null, 2))
