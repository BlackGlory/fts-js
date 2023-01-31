import { server } from './token-manager.mock.js'
import { TokenManager } from '@manager/token-manager.js'
import { ADMIN_PASSWORD } from '@test/utils.js'
import '@test/polyfill.js'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TokenManager', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createManager()

    const result = await client.getNamespaces()

    expect(result).toStrictEqual(['namespace'])
  })

  test(`
    getTokens(namespace: string): Promise<Array<{
      token: string
      write: boolean
      query: boolean
    }>>
  `, async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.getTokens(namespace)

    expect(result).toStrictEqual([{
      token: 'token'
    , write: true
    , query: false
    , delete: false
    }])
  })

  test('addWriteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.addWriteToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('removeWriteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.removeWriteToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('addQueryToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.addQueryToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('removeQueryToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.removeQueryToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('addDeleteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.addDeleteToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('removeDeleteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.removeDeleteToken(namespace, token)

    expect(result).toBeUndefined()
  })
})

function createManager() {
  return new TokenManager({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
