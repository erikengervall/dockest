export const hashCode = (str: string) =>
  Array.from(str).reduce((hash, char) => (Math.imul(31, hash) + char.charCodeAt(0)) | 0, 0);
