const global: any = {
  info: () => ({}),
  loading: () => ({}),
  error: () => ({}),
}
const runner: any = {
  setup: () => ({}),
  setupSuccess: () => ({}),
  startContainer: () => ({}),
  startContainerSuccess: () => ({}),
  checkHealth: () => ({}),
  checkHealthSuccess: () => ({}),
  checkResponsiveness: () => ({}),
  checkResponsivenessSuccess: () => ({}),
  checkConnection: () => ({}),
  checkConnectionSuccess: () => ({}),
  teardown: () => ({}),
  teardownSuccess: () => ({}),
  stopContainer: () => ({}),
  stopContainerSuccess: () => ({}),
  removeContainer: () => ({}),
  removeContainerSuccess: () => ({}),
  shellCmd: () => ({}),
}

const runnerutil: any = {
  customShellCmd: () => ({}),
  customShellCmdSuccess: () => ({}),
}
const jest: any = {
  success: () => ({}),
  failed: () => ({}),
  error: () => ({}),
}

export { global as GlobalLogger }
export { runner as RunnerLogger }
export { runnerutil as RunnerUtilsLogger }
export { jest as JestLogger }

// export { default as GlobalLogger } from './GlobalLogger'
// export { default as RunnerLogger } from './RunnerLogger'
// export { default as RunnerUtilsLogger } from './RunnerUtilsLogger'
// export { default as JestLogger } from './JestLogger'
