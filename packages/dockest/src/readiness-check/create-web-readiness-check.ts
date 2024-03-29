import { withNoStop } from './with-no-stop';
import { withRetry } from './with-retry';
import { ReadinessCheck, Runner } from '../@types';
import { execaWrapper } from '../utils/execa-wrapper';

type PortConfig = number | ((runner: Runner) => MaybePromise<number>);
type MaybePromise<T> = T | Promise<T>;

const webReadinessCheck =
  (portConfig: PortConfig): ReadinessCheck =>
  async (args) => {
    const port = await (typeof portConfig === 'function' ? portConfig(args.runner) : portConfig);
    const command = `docker exec ${args.runner.containerId} \
                          sh -c "wget --quiet --tries=1 --spider http://localhost:${port}/.well-known/healthcheck"`;

    execaWrapper(command, { runner: args.runner });
  };

export const createWebReadinessCheck = (args?: { port?: PortConfig; retryCount?: number }): ReadinessCheck =>
  withNoStop(withRetry(webReadinessCheck(args?.port ?? 3000), { retryCount: args?.retryCount ?? 30 }));
