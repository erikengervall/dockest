import { safeLoad } from 'js-yaml';
import { z } from 'zod';

const StringNumber = z.union([z.number(), z.string()]).transform((port) => {
  if (typeof port === 'string') {
    return parseInt(port, 10);
  }

  return port;
});
type StringNumber = z.infer<typeof StringNumber>;

const Port = z.object({
  published: StringNumber,
  target: StringNumber,
});
type Port = z.infer<typeof Port>;

const Service = z.object({
  image: z.string(),
  ports: z.array(Port),
});
type Service = z.infer<typeof Service>;

const ComposeFile = z.object({
  version: z.string(),
  services: z.record(Service),
});
type ComposeFile = z.infer<typeof ComposeFile>;

export function getParsedComposeFile(mergedComposeFiles: string): {
  dockerComposeFile: ComposeFile;
} {
  const loadedMergedComposeFiles = safeLoad(mergedComposeFiles);
  const parsedMergedComposeFiles = ComposeFile.parse(loadedMergedComposeFiles);

  return {
    dockerComposeFile: parsedMergedComposeFiles,
  };
}
