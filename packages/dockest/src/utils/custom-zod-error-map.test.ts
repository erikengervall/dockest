import { z } from 'zod';

import { customZodErrorMap } from './custom-zod-error-map';

const Person = z.object({
  name: z.string(),
});

describe('customZodErrorMap', () => {
  it('should append the input data when passed to a parse', () => {
    expect(() => Person.parse({ name: 123 }, { errorMap: customZodErrorMap({ appendInputData: true }) }))
      .toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "number",
          "path": [
            "name"
          ],
          "message": "Expected string, received number [DATA]<123>"
        }
      ]"
    `);
  });

  it('should omit the input data when configured to', () => {
    expect(() => Person.parse({ name: 123 }, { errorMap: customZodErrorMap({ appendInputData: false }) }))
      .toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "number",
          "path": [
            "name"
          ],
          "message": "Expected string, received number"
        }
      ]"
    `);
  });

  it('should not change the global error map', () => {
    expect(() => Person.parse({ name: 123 })).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "number",
          "path": [
            "name"
          ],
          "message": "Expected string, received number"
        }
      ]"
    `);
  });
});
