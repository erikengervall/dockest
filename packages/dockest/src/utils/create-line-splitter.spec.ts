import { createLineSplitter } from './create-line-splitter';

describe('createLineSplitter', () => {
  it('should return every complete line of a chunk', () => {
    const splitLines = createLineSplitter();

    expect(splitLines('{"a":1}\n{"b":2}\n')).toEqual(['{"a":1}', '{"b":2}']);
  });

  it('should join a line split across chunks', () => {
    const splitLines = createLineSplitter();

    expect(splitLines('{"action":"st')).toEqual([]);
    expect(splitLines('art"}\n{"action":"die"}\n')).toEqual(['{"action":"start"}', '{"action":"die"}']);
  });

  it('should skip empty lines', () => {
    const splitLines = createLineSplitter();

    expect(splitLines(Buffer.from('\n\n{"a":1}\n'))).toEqual(['{"a":1}']);
  });
});
