import { safeLoad } from 'js-yaml';
import { z } from 'zod';
import { DockestError } from '../../errors';
import { formatZodError } from '../../utils/format-zod-error';

const StringNumber = z.union([z.number(), z.string()]).transform((port) => {
  if (typeof port === 'string') {
    return parseInt(port, 10);
  }

  return port;
});
type StringNumber = z.infer<typeof StringNumber>;

const Port = z
  .object({
    published: StringNumber,
    target: StringNumber,
  })
  .passthrough();
type Port = z.infer<typeof Port>;

const Environment = z.record(z.union([z.string(), z.number()]));
type Environment = z.infer<typeof Environment>;

const Service = z
  .object({
    environment: Environment.optional(),
    image: z.string().optional(),
    ports: z.array(Port),
  })
  .passthrough();
type Service = z.infer<typeof Service>;

const ComposeFile = z
  .object({
    version: z.string().optional(),
    services: z.record(Service),
  })
  .passthrough();
type ComposeFile = z.infer<typeof ComposeFile>;

export function getParsedComposeFile(mergedComposeFiles: string): {
  dockerComposeFile: ComposeFile;
} {
  const loadedMergedComposeFiles = safeLoad(mergedComposeFiles);
  const parsedMergedComposeFiles = ComposeFile.safeParse(loadedMergedComposeFiles);

  if (!parsedMergedComposeFiles.success) {
    throw new DockestError(`Invalid Composefile
${formatZodError(parsedMergedComposeFiles.error, 'ComposeFile')}`);
  }

  return {
    dockerComposeFile: parsedMergedComposeFiles.data,
  };
}
