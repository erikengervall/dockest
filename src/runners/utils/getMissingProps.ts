const getObjectDifference = (requiredFields: { [key: string]: string }): string[] =>
  Object.keys(requiredFields).reduce(
    (acc: string[], requiredField: string) =>
      !!requiredFields[requiredField] ? acc : acc.concat(requiredField),
    []
  )

export default getObjectDifference
