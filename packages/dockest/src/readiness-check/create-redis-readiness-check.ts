import { withNoStop } from './with-no-stop';
import { withRetry } from './with-retry';
import { ReadinessCheck, Runner } from '../@types';
import { execaWrapper } from '../utils/execa-wrapper';

type PortConfig = number | ((runner: Runner) => MaybePromise<number>);
type MaybePromise<T> = T | Promise<T>;

const defaultPortConfig: PortConfig = () => 6379;

const redisReadinessCheck =
  (portConfig: PortConfig): ReadinessCheck =>
  async (args) => {
    const port = await (typeof portConfig === 'function' ? portConfig(args.runner) : portConfig);
    const command = `docker exec ${args.runner.containerId} redis-cli \
                        -h localhost \
                        -p ${port} \
                        PING`;

    await execaWrapper(command, { runner: args.runner });
  };

export const createRedisReadinessCheck = (args?: { port?: PortConfig; retryCount?: number }): ReadinessCheck =>
  withNoStop(
    withRetry(redisReadinessCheck(args?.port ?? defaultPortConfig), {
      retryCount: args?.retryCount ?? 30,
    }),
  );
