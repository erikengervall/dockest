import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

/**
 * Format a ZodError into a string with a newline per issue
 *
 * Completely missing fields in an object will be output as `Required at "path.to.field"`
 *
 * There's a hard limit of 100 issues in the message, so if you have more than 100 issues, you'll get a truncated message.
 */
export function formatZodError(
  zodError: ZodError,
  /**
   * The Zod model's name, E.g. "Person".
   */
  modelName: string,
) {
  const { message, name } = fromZodError(zodError, {
    issueSeparator: '\n',
    prefix: '',
    prefixSeparator: '',
    unionSeparator: '\n',
    maxIssuesInMessage: 100,
  });

  return `[${name} for "${modelName}"]
${message}`;
}
