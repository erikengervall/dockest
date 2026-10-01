import { z } from 'zod';

type CustomZodErrorMapOptions = {
  /**
   * Append the input data to the default error message.
   */
  appendInputData?: boolean;
};

const DEFAULT_CUSTOM_ZOD_ERROR_MAP_OPTIONS: CustomZodErrorMapOptions = {
  appendInputData: true,
};

/**
 * Create a custom ZodErrorMap with options to append input data to the default error message.
 *
 * Pass it per parse, e.g. `Person.safeParse(person, { errorMap: customZodErrorMap() })`, so the global
 * error map of an application sharing the zod instance is left alone.
 */
export function customZodErrorMap(
  customZodErrorMapOptions: CustomZodErrorMapOptions = DEFAULT_CUSTOM_ZOD_ERROR_MAP_OPTIONS,
): z.ZodErrorMap {
  return (_issue, ctx) => {
    if (!customZodErrorMapOptions.appendInputData) {
      return {
        message: ctx.defaultError,
      };
    }

    return {
      message: `${ctx.defaultError} [DATA]<${JSON.stringify(ctx.data)}>`,
    };
  };
}
