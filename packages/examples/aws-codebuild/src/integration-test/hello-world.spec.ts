import http from 'http';
import fetch from 'node-fetch';
import { getHostAddress, getServiceAddress } from 'dockest/test-helper';

const TARGET_HOST = getServiceAddress('aws_codebuild_website', 9000);

// hostname is either our docker container hostname or if not run inside a docker container the docker host
const HOSTNAME = getHostAddress();
const PORT = 8080;

let server: http.Server;

afterEach(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(void 0);
      });
    });
  }
});

test('can send a request to the container and it can send a request to us', async done => {
  await new Promise(resolve => {
    server = http
      .createServer((_req, res) => {
        res.write('Hello World!');
        res.end();
        done();
      })
      .listen(PORT, () => {
        console.log(`Serving on http://${HOSTNAME}:${PORT}`); // eslint-disable-line no-console
        resolve(void 0);
      });
  });

  const res = await fetch(`http://${TARGET_HOST}`, {
    method: 'post',
    body: `http://${HOSTNAME}:${PORT}`,
  }).then(res => res.text());

  expect(res).toEqual('OK.');
});
