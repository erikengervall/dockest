import { safeLoad } from 'js-yaml'
import * as io from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import * as Either from 'fp-ts/lib/Either'
import { pipe, identity, flow } from 'fp-ts/lib/function'
import { DockestError } from '../../Errors'

const PortBinding = io.type({
  published: io.number,
  target: io.number,
})
type PortBinding = io.TypeOf<typeof PortBinding>

const PortBindingInput = io.type({
  published: io.union([io.number, io.string]),
  target: io.union([io.number, io.string]),
})

const PortBindingFromComposeFile = new io.Type(
  'PortBindingFromComposeFile',
  PortBinding.is,
  (input, context) => {
    const result = pipe(
      PortBindingInput.validate(input, context),
      Either.fold(
        err =>
          io.failure(
            input,
            context,
            'Could not decode the port mappings. This is most likely related to a breaking change in the docker-compose format.\n' +
              `Received: ${JSON.stringify(input)}\n` +
              err
                .filter(err => err.message)
                .map(err => `- ${err.message}`)
                .join('\n') +
              'Are you using the Long Port Format (https://docs.docker.com/compose/compose-file/compose-file-v3/#long-syntax-1)? If you are and are still experiencing issues, please report this issue on the dockest issue tracker: https://github.com/erikengervall/dockest/issues',
          ),
        binding =>
          io.success({
            published: Number(binding.published),
            target: Number(binding.target),
          }),
      ),
    )

    return result
  },
  identity,
)

const DockerComposeService = io.partial({
  ports: io.array(PortBindingFromComposeFile),
})

const ComposeFile = io.type({
  services: io.record(io.string, DockerComposeService),
})

const handleDecodeError = (err: io.Errors) => {
  const lines = PathReporter.report(Either.left(err))
  throw new DockestError('Invalid schema. \n' + lines.map(line => `- ${line}`).join('\n'))
}

const decodeComposeFile = flow(ComposeFile.decode, Either.fold(handleDecodeError, identity))

export function getParsedComposeFile(mergedComposeFiles: string) {
  const dockerComposeFile = pipe(mergedComposeFiles, safeLoad, decodeComposeFile)

  return {
    dockerComposeFile,
  }
}
