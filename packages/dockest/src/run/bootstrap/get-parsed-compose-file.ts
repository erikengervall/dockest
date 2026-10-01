import { safeLoad } from 'js-yaml';
import { z } from 'zod';
import { DockestError } from '../../errors';
import { customZodErrorMap } from '../../utils/custom-zod-error-map';
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
    /** Absent when the host port is assigned by Docker, e.g. `- "6379"` */
    published: StringNumber.optional(),
    target: StringNumber,
  })
  .passthrough();
type Port = z.infer<typeof Port>;

/** `docker compose config` emits `null` for variables declared without a value */
const Environment = z.record(z.union([z.string(), z.number(), z.null()]));
type Environment = z.infer<typeof Environment>;

const Service = z
  .object({
    environment: Environment.optional(),
    image: z.string().optional(),
    ports: z.array(Port).optional(),
  })
  .passthrough();
type Service = z.infer<typeof Service>;

const ComposeFile = z
  .object({
    /** The Compose project name, emitted by Compose v2 */
    name: z.string().optional(),
    /** Obsolete in the Compose Specification and dropped by `docker compose config` */
    version: z.string().optional(),
    services: z.record(Service),
  })
  .passthrough();
type ComposeFile = z.infer<typeof ComposeFile>;

export function getParsedComposeFile(mergedComposeFiles: string): {
  dockerComposeFile: ComposeFile;
} {
  const loadedMergedComposeFiles = safeLoad(mergedComposeFiles);
  const parsedMergedComposeFiles = ComposeFile.safeParse(loadedMergedComposeFiles, { errorMap: customZodErrorMap() });

  if (!parsedMergedComposeFiles.success) {
    throw new DockestError(`Invalid Composefile
${formatZodError(parsedMergedComposeFiles.error, 'ComposeFile')}`);
  }

  return {
    dockerComposeFile: parsedMergedComposeFiles.data,
  };
}
