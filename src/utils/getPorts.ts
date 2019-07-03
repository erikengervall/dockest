const getPorts = (ports: { [key: string]: string }): { ports: string[] } => ({
  ports: Object.keys(ports).map(key => {
    const externalPort = key
    const internalPort = ports[key]

    return `${externalPort}:${internalPort}`
  }),
})

export default getPorts
