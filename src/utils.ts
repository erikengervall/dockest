import ConfigurationError from './errors/ConfigurationError'

const validateInputFields = (origin: string, requiredFields: any): void => {
  const missingFields = Object.keys(requiredFields).reduce(
    (acc: boolean[], requiredField: any) =>
      !!requiredFields[requiredField] ? acc : acc.concat(requiredField),
    []
  )

  if (missingFields.length !== 0) {
    throw new ConfigurationError(
      `Invalid ${origin} configuration, missing required fields: [${missingFields.join(', ')}]`
    )
  }
}

export { validateInputFields }
