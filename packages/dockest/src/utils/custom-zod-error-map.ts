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
 * `customZodErrorMap` can also be used in individual parsings, for example:
 *  `Person.safeParse(person, { errorMap: customZodErrorMap() });`
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

/**
 * There can only be one global ZodErrorMap set at any one time.
 *
 * Using this function will set the global ZodErrorMap to `customZodErrorMap`.
 *
 * The default ZodErrorMap can still be used in individual parsings, for example:
 * `Person.safeParse(person, { errorMap: z.defaultErrorMap });`
 */
export function setGlobalCustomZodErrorMap(options: CustomZodErrorMapOptions = DEFAULT_CUSTOM_ZOD_ERROR_MAP_OPTIONS) {
  z.setErrorMap(customZodErrorMap(options));
}

/**
 * There can only be one global ZodErrorMap set at any one time.
 *
 * Using this function will reset the global ZodErrorMap to `z.defaultErrorMap`,
 * essentially overriding the previous global ZodErrorMap.
 */
export function resetGlobalCustomZodErrorMap() {
  z.setErrorMap(z.defaultErrorMap);
}
