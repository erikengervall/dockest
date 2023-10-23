import { fromEventPattern, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { DockerEventEmitter, DockerEventType } from './create-docker-event-emitter';

export type DockerServiceEventStream = Observable<DockerEventType>;

export const createDockerServiceEventStream = (
  serviceName: string,
  eventEmitter: DockerEventEmitter,
): DockerServiceEventStream =>
  fromEventPattern<DockerEventType>(
    (handler) => {
      eventEmitter.addListener(serviceName, handler);
    },
    (handler) => {
      eventEmitter.removeListener(serviceName, handler);
    },
  )
    // Every new subscriber should receive access to all previous emitted events, because of this we use shareReplay.
    .pipe(shareReplay());
