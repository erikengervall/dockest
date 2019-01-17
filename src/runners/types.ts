export interface IRunner {
  setup: () => Promise<void>
  teardown: () => Promise<void>
  getHelpers: () => Promise<{
    clear: () => boolean
    loadData: () => boolean
  }>
}
