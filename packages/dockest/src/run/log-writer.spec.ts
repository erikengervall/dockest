import { Readable, Writable } from 'stream'
import { createLogWriter } from './log-writer'

let writableMap: {
  [name: string]: Writable
}

let resultMap: {
  [name: string]: {
    text: string
  }
}

jest.mock('execa', () => {
  return (command: string, args: Array<string>) => {
    if (command !== 'docker-compose') {
      fail('The mock is only expected to handle docker-compose execution.')
    }

    const serviceName = args.slice(0).pop() as string

    const result = new Promise<void>(resolve => resolve())
    const stdout = Readable.from([`mock text from ${serviceName}\n`])
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    result.stdout = stdout
    return result
  }
})

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  createWriteStream: (name: string) => {
    if (!writableMap[name]) {
      writableMap[name] = new Writable({
        write: (chunk, _, next) => {
          if (!resultMap[name]) {
            resultMap[name] = {
              text: '',
            }
          }
          resultMap[name].text += chunk.toString()
          next()
        },
      })
    }
    return writableMap[name]
  },
}))

// for the tests we mock the input and output in order to check whether stuff is forwarded correctly.
beforeEach(() => {
  writableMap = {}
  resultMap = {}
})

test('it can be created', () => {
  createLogWriter({
    logPath: './',
    mode: ['aggregate'],
    serviceNameFilter: [],
  })
})

test('can collect aggregated logs', async () => {
  const writer = createLogWriter({
    logPath: '.',
    mode: ['aggregate'],
  })

  writer.register('foo', '1')
  await new Promise(res => setImmediate(res))
  expect(resultMap).toMatchInlineSnapshot(`
    {
      "dockest.log": {
        "text": "mock text from foo
    ",
      },
    }
  `)
})

test('can collect individual logs', async () => {
  const writer = createLogWriter({
    logPath: '.',
    mode: ['per-service'],
  })

  writer.register('foo', '1')
  await new Promise(res => setImmediate(res))
  expect(resultMap).toMatchInlineSnapshot(`
    {
      "foo.dockest.log": {
        "text": "mock text from foo
    ",
      },
    }
  `)
})

test('can collect individual and aggregated logs', async () => {
  const writer = createLogWriter({
    logPath: '.',
    mode: ['aggregate', 'per-service'],
  })

  writer.register('foo', '1')

  await new Promise(res => setImmediate(res))
  expect(resultMap).toMatchInlineSnapshot(`
    {
      "dockest.log": {
        "text": "mock text from foo
    ",
      },
      "foo.dockest.log": {
        "text": "mock text from foo
    ",
      },
    }
  `)
})

test('can collect individual and aggregated logs from multiple services', async () => {
  const writer = createLogWriter({
    logPath: '.',
    mode: ['aggregate', 'per-service'],
  })

  writer.register('foo', '1')
  writer.register('bar', '2')

  await new Promise(res => setImmediate(res))
  expect(resultMap).toMatchInlineSnapshot(`
    {
      "bar.dockest.log": {
        "text": "mock text from bar
    ",
      },
      "dockest.log": {
        "text": "mock text from foo
    mock text from bar
    ",
      },
      "foo.dockest.log": {
        "text": "mock text from foo
    ",
      },
    }
  `)
})
