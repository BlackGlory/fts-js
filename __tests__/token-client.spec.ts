import { server } from '@test/token.mock'
import { TokenClient } from '@src/token-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TokenClient', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getNamespaces()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['namespace'])
  })

  test(`
    getTokens(namespace: string): Promise<Array<{
      token: string
      write: boolean
      query: boolean
    }>>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.getTokens(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual([{
      token: 'token'
    , write: true
    , query: false
    , delete: false
    }])
  })

  test('addWriteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const token = 'token'

    const result = client.addWriteToken(namespace, token)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('removeWriteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const token = 'token'

    const result = client.removeWriteToken(namespace, token)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('addQueryToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const token = 'token'

    const result = client.addQueryToken(namespace, token)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('removeQueryToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const token = 'token'

    const result = client.removeQueryToken(namespace, token)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('addDeleteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const token = 'token'

    const result = client.addDeleteToken(namespace, token)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('removeDeleteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const token = 'token'

    const result = client.removeDeleteToken(namespace, token)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })
})

function createClient() {
  return new TokenClient({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
