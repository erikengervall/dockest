import { EventEmitter } from 'events';
import execa from 'execa'; /* eslint-disable-line import/default */

const parseJsonSafe = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

export interface DockerComposeEventInterface<
  TActionName extends string,
  TAdditionalAttributes extends Record<string, unknown> = Record<string, unknown>,
> {
  time: string;
  type: 'container';
  action: TActionName;
  id: string;
  service: string;
  attributes: {
    image: string;
    name: string;
  } & TAdditionalAttributes;
}

export type CreateDockerComposeEvent = DockerComposeEventInterface<'create'>;
export type AttachDockerComposeEvent = DockerComposeEventInterface<'attach'>;
export type StartDockerComposeEvent = DockerComposeEventInterface<'start'>;
export type HealthStatusDockerComposeEvent = DockerComposeEventInterface<
  'health_status',
  { healthStatus: 'healthy' | 'unhealthy' }
>;
export type KillDockerComposeEvent = DockerComposeEventInterface<'kill'>;
export type DieDockerComposeEvent = DockerComposeEventInterface<
  'die',
  {
    exitCode: string;
  }
>;

export type DockerEventType =
  | CreateDockerComposeEvent
  | AttachDockerComposeEvent
  | StartDockerComposeEvent
  | HealthStatusDockerComposeEvent
  | KillDockerComposeEvent
  | DieDockerComposeEvent;

export type UnknownDockerComposeEvent = DockerComposeEventInterface<string>;

export type DockerEventEmitterListener = (event: DockerEventType) => void;

export interface DockerEventEmitter {
  addListener(serviceName: string, eventListener: DockerEventEmitterListener): void;
  removeListener(serviceName: string, eventListener: DockerEventEmitterListener): void;
  destroy(): void;
}

export const isDieEvent = (event: DockerEventType): event is DieDockerComposeEvent => event.action === 'die';
export const isKillEvent = (event: DockerEventType): event is KillDockerComposeEvent => event.action === 'kill';

export const createDockerEventEmitter = (composeFilePath: string): DockerEventEmitter => {
  const command = `docker-compose --file ${composeFilePath} events --json`;

  const childProcess = execa(command, { shell: true, reject: false });

  if (!childProcess.stdout) {
    childProcess.kill();
    throw new Error('Event Process has not output stream.');
  }

  const emitter = new EventEmitter();

  // without this line only the first data event is fired (in some undefinable cases)
  childProcess.then(() => {
    return undefined;
  });

  childProcess.stdout.addListener('data', (chunk) => {
    const lines: string[] = chunk.toString().split(`\n`).filter(Boolean);

    for (const line of lines) {
      const data: UnknownDockerComposeEvent = parseJsonSafe(line);
      if (!data) return;

      // convert health status to friendlier format
      if (data.action.startsWith('health_status: ')) {
        const healthStatus = data.action
          .replace('health_status: ', '')
          .trim() as HealthStatusDockerComposeEvent['attributes']['healthStatus'];
        data.action = 'health_status';
        (data as HealthStatusDockerComposeEvent).attributes.healthStatus = healthStatus;
      }

      emitter.emit(data.service, data);
    }
  });

  return Object.assign(emitter, {
    destroy: () => childProcess.cancel(),
  });
};
