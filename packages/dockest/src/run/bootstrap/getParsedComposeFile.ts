import { safeLoad } from 'js-yaml'
import { z } from 'zod'

export function getParsedComposeFile(
  mergedComposeFiles: string,
): {
  dockerComposeFile: {
    services: {
      [x: string]: {
        ports?: unknown[] | undefined
      }
    }
  }
} {
  const StringNumber = z.union([z.number(), z.string()]).transform(port => {
    if (typeof port === 'string') {
      return parseInt(port, 10)
    }

    return port
  })
  const Port = z.object({
    published: StringNumber,
    target: StringNumber,
  })
  const Service = z.object({
    image: z.string(),
    ports: z.array(Port),
  })
  const ComposeFile = z.object({
    version: z.string(),
    services: z.record(Service),
  })
  const loadedMergedComposeFiles = safeLoad(mergedComposeFiles)
  const parsedMergedComposeFiles = ComposeFile.parse(loadedMergedComposeFiles)

  return {
    dockerComposeFile: parsedMergedComposeFiles,
  }
}
