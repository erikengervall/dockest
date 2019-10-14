import { ObjStrStr } from '../../@types'

const { keys } = Object

const getPorts = (ports: ObjStrStr): { ports: string[] } => ({
  ports: keys(ports).map(key => {
    const externalPort = key
    const internalPort = ports[key]

    return `${externalPort}:${internalPort}`
  }),
})

export default getPorts
