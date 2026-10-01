/**
 * Split a stream of chunks into complete lines. A chunk boundary can fall mid-line, so the trailing partial line
 * is held back until the next chunk completes it.
 */
export const createLineSplitter = () => {
  let remainder = '';

  return (chunk: Buffer | string): string[] => {
    const lines = (remainder + chunk.toString()).split('\n');
    remainder = lines.pop() ?? '';

    return lines.filter(Boolean);
  };
};
