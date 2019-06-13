export type runnerMethods = {
  getComposeService: (
    dockerComposeFileName: string
  ) => {
    [key: string]: {
      image: string
      depends_on?: object
      port?: string
      ports: string[]
      environment?: {
        [key: string]: string | number
      }
    }
  }
  checkResponsiveness?: () => Promise<void>
}

class BaseRunner {
  public containerId: string
  public runnerKey: string

  constructor() {
    this.containerId = ''
    this.runnerKey = ''
  }
}

export default BaseRunner
