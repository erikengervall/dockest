export type ComposeFile = {
  image: string
  depends_on?: object
  port?: string
  ports: string[]
  environment?: {
    [key: string]: string | number
  }
}

export type GetComposeService = (dockerComposeFileName: string) => { [key: string]: ComposeFile }
